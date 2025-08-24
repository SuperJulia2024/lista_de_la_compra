import { createClient } from '@supabase/supabase-js';
import Sortable from 'sortablejs'; // Import SortableJS

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Application Script Started: DOM Content Loaded - Initializing application...');

  try {
    // Supabase Client Initialization - Check both import.meta.env and window.env
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || window.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || window.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Please check your .env file.");
      const appDiv = document.getElementById('app');
      if (appDiv) {
        appDiv.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Error: Credenciales de Supabase no configuradas. Por favor, revisa tu archivo .env.</p>';
        appDiv.style.backgroundColor = '#ffebee';
        appDiv.style.border = '1px solid #ef9a9a';
      }
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // DOM Elements for Shopping List
    const itemInput = document.getElementById('item-input');
    const addItemBtn = document.getElementById('add-item-btn');
    const shoppingList = document.getElementById('shopping-list');
    const clearListBtn = document.getElementById('clear-list-btn');
    const emptyListMessage = document.getElementById('empty-list-message');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    // Removed: dragPlaceholder creation and appending

    if (!itemInput || !addItemBtn || !shoppingList || !clearListBtn || !emptyListMessage || !confirmationModal || !confirmDeleteBtn || !cancelDeleteBtn) {
      console.error("One or more required DOM elements for shopping list were not found. Check your HTML IDs.");
      const appDiv = document.getElementById('app');
      if (appDiv) {
        appDiv.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Error: Faltan elementos esenciales de la interfaz. Por favor, contacta al soporte.</p>';
        appDiv.style.backgroundColor = '#ffebee';
        appDiv.style.border = '1px solid #ef9a9a';
      }
      return;
    }

    // DOM Elements for Authentication
    const authSection = document.getElementById('auth-section');
    const shoppingListSection = document.getElementById('shopping-list-section');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const signInBtn = document.getElementById('signin-btn');
    const authMessage = document.getElementById('auth-message');

    if (!authSection || !shoppingListSection || !emailInput || !passwordInput || !signInBtn || !authMessage) {
      console.error("One or more required DOM elements for authentication were not found. Check your HTML IDs.");
      const appDiv = document.getElementById('app');
      if (appDiv) {
        appDiv.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Error: Faltan elementos esenciales de la interfaz. Por favor, contacta al soporte.</p>';
        appDiv.style.backgroundColor = '#ffebee';
        appDiv.style.border = '1px solid #ef9a9a';
      }
      return;
    }

    // --- Shopping List Functions (now interacting with Supabase) ---
    let currentUserId = null; // To store the current authenticated user's ID
    let realtimeSubscription = null; // To store the realtime subscription
    // Removed: draggedItem global reference

    async function fetchItems() {
      if (!currentUserId) {
        shoppingList.innerHTML = '';
        emptyListMessage.classList.remove('hidden');
        clearListBtn.disabled = true;
        clearListBtn.classList.add('disabled');
        return [];
      }

      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', currentUserId)
        .order('order', { ascending: true }); // Order by the new 'order' column

      if (error) {
        console.error('Error fetching items:', error.message);
        return [];
      }
      return data;
    }

    async function renderList() {
      try {
        const items = await fetchItems();
        
        // Only re-render if the content has actually changed
        const currentContent = shoppingList.innerHTML;
        const newContent = generateListHTML(items);
        
        if (currentContent !== newContent) {
          shoppingList.innerHTML = newContent;
          console.log('List re-rendered due to changes');
        }
        
        // Update UI state
        if (items.length === 0) {
          emptyListMessage.classList.remove('hidden');
          clearListBtn.disabled = true;
          clearListBtn.classList.add('disabled');
        } else {
          emptyListMessage.classList.add('hidden');
          clearListBtn.disabled = false;
          clearListBtn.classList.remove('disabled');
        }
      } catch (error) {
        console.error('Error rendering list:', error);
      }
    }
    
    // Helper function to generate HTML for the list
    function generateListHTML(items) {
      if (items.length === 0) {
        return '';
      }
      
      return items.map(item => {
        const itemText = item.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `
          <li data-id="${item.id}" data-order="${item.order}">
            <span class="drag-handle" aria-label="Arrastrar elemento">☰</span>
            <span class="item-text">${itemText}</span>
            <div class="item-actions">
              <button class="person-btn ${item.elisa_active ? 'active-person' : ''}" data-person="elisa" aria-label="Asignar a Elisa">Elisa</button>
              <button class="person-btn ${item.jorge_active ? 'active-person' : ''}" data-person="jorge" aria-label="Asignar a Jorge">Jorge</button>
              <button class="edit-item-btn" aria-label="Editar ${itemText}">✏️</button>
              <button class="remove-item-btn" aria-label="Eliminar ${itemText}">✖</button>
            </div>
          </li>
        `;
      }).join('');
    }

    // Function to handle realtime updates
    function handleRealtimeUpdate(payload) {
      console.log('=== REALTIME UPDATE RECEIVED ===');
      console.log('Event Type:', payload.eventType);
      console.log('Payload:', payload);
      console.log('Time:', new Date().toISOString());
      
      // Handle different types of changes
      if (payload.eventType === 'INSERT') {
        console.log('🆕 New item added, re-rendering list...');
      } else if (payload.eventType === 'UPDATE') {
        console.log('✏️ Item updated, re-rendering list...');
      } else if (payload.eventType === 'DELETE') {
        console.log('🗑️ Item deleted, re-rendering list...');
      }
      
      // Add a small delay to ensure the database has fully processed the change
      setTimeout(() => {
        console.log('Re-rendering list after realtime update...');
        renderList();
      }, 100);
    }

    // Function to setup realtime subscription
    function setupRealtimeSubscription() {
      if (!currentUserId) {
        console.log('No current user ID, skipping realtime subscription setup');
        return;
      }

      console.log('=== SETUP REALTIME SUBSCRIPTION ===');
      console.log('User ID:', currentUserId);

      // Clean up existing subscription if any
      cleanupRealtimeSubscription();

      // Create a polling mechanism as a fallback
      let pollInterval = null;
      let reconnectAttempts = 0;
      const MAX_RECONNECT_ATTEMPTS = 5;
      
      const pollForChanges = async () => {
        try {
          console.log('Polling for changes...', new Date().toISOString());
          
          // Force a re-render to ensure we have the latest data
          await renderList();
        } catch (error) {
          console.error('Error in polling:', error);
        }
      };

      const setupSubscription = () => {
        try {
          // Try WebSocket-based realtime
          const channelName = `items-${currentUserId}`;
          console.log('Creating realtime channel:', channelName);
          
          // Clean up any existing subscription first
          cleanupRealtimeSubscription();
          
          // Create a new channel with self-broadcast enabled
          realtimeSubscription = supabase.channel(channelName, {
            config: {
              broadcast: { ack: true, self: true },
              presence: { key: `user-${currentUserId}` },
              reconnect: true
            }
          });
          
          // Listen for all changes on the items table
          realtimeSubscription
            .on('postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'items',
                filter: `user_id=eq.${currentUserId}`
              },
              handleRealtimeUpdate
            )
            .on('broadcast', { event: 'test' }, (payload) => {
              console.log('Broadcast received:', payload);
            })
            .on('system', (payload) => {
              console.log('System event:', payload);
              if (payload.event === 'CLOSE') {
                console.log('WebSocket closed, attempting to reconnect...');
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                  reconnectAttempts++;
                  setTimeout(setupSubscription, 2000 * reconnectAttempts);
                }
              } else if (payload.event === 'CHANNEL_ERROR') {
                console.error('Channel error:', payload);
              }
            })
            .subscribe((status, err) => {
              console.log('=== REALTIME STATUS ===');
              console.log('Status:', status);
              console.log('Error:', err);
              console.log('Time:', new Date().toISOString());
              
              if (status === 'SUBSCRIBED') {
                console.log('✅ Successfully subscribed to realtime updates');
                reconnectAttempts = 0; // Reset reconnect attempts on successful connection
                // Start polling as a fallback
                if (!pollInterval) {
                  pollInterval = setInterval(pollForChanges, 10000); // Poll every 10 seconds
                }
              } else if (status === 'CHANNEL_ERROR') {
                console.error('❌ Channel error, falling back to polling');
                if (!pollInterval) {
                  pollInterval = setInterval(pollForChanges, 5000); // More frequent polling on error
                }
              } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
                console.error(`❌ Realtime ${status.toLowerCase()}, attempting to reconnect...`);
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                  reconnectAttempts++;
                  setTimeout(setupSubscription, 2000 * reconnectAttempts);
                } else if (!pollInterval) {
                  pollInterval = setInterval(pollForChanges, 5000);
                }
              }
            });
            
        } catch (error) {
          console.error('Error in setupSubscription:', error);
          // Fall back to polling if WebSocket fails
          if (!pollInterval) {
            console.log('Falling back to polling due to error');
            pollInterval = setInterval(pollForChanges, 5000);
          }
        }
      };
      
      // Initial setup
      setupSubscription();
      
      // Store cleanup function for later use
      const cleanup = () => {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        cleanupRealtimeSubscription();
      };
      
      // Store cleanup function in the global scope so it can be called from cleanupRealtimeSubscription
      window.currentRealtimeCleanup = cleanup;
      
      return cleanup;
    }

    // Function to cleanup realtime subscription
    function cleanupRealtimeSubscription() {
      if (realtimeSubscription) {
        console.log('Cleaning up realtime subscription');
        supabase.removeChannel(realtimeSubscription);
        realtimeSubscription = null;
      }
      
      // Also cleanup polling interval if it exists
      if (window.currentRealtimeCleanup) {
        console.log('Cleaning up realtime polling interval');
        window.currentRealtimeCleanup();
        window.currentRealtimeCleanup = null;
      }
    }

    async function addItem() {
      const newItemText = itemInput.value.trim();
      if (newItemText && currentUserId) {
        // Determine the order for the new item
        const { data: existingItems, error: fetchOrderError } = await supabase
          .from('items')
          .select('order')
          .eq('user_id', currentUserId)
          .order('order', { ascending: false })
          .limit(1);

        let newOrder = 1.0; // Default order if no items exist
        if (existingItems && existingItems.length > 0) {
          newOrder = existingItems[0].order + 1.0;
        }

        const { data, error } = await supabase
          .from('items')
          .insert([
            { user_id: currentUserId, text: newItemText, elisa_active: false, jorge_active: false, order: newOrder }
          ])
          .select();

        if (error) {
          console.error('Error adding item:', error.message);
          return;
        }
        itemInput.value = '';
        // Update the list immediately for better UX
        await renderList();
        // Note: renderList() will also be called automatically by the realtime subscription
      }
    }

    async function removeItem(itemId) {
      console.log('removeItem called with itemId:', itemId);
      
      if (!itemId) {
        console.error('Invalid itemId for removeItem:', itemId);
        return;
      }

      if (!currentUserId) {
        console.error('No current user ID for removeItem');
        return;
      }

      try {
        console.log('Attempting to delete item:', itemId, 'for user:', currentUserId);
        
        const { error } = await supabase
          .from('items')
          .delete()
          .eq('id', itemId)
          .eq('user_id', currentUserId);

        if (error) {
          console.error('Error removing item:', error.message);
          alert('Error al eliminar el artículo: ' + error.message);
          return;
        }

        console.log('Item removed successfully:', itemId);
        // Update the list immediately for better UX
        await renderList();
        // Note: renderList() will also be called automatically by the realtime subscription
      } catch (error) {
        console.error('Unexpected error in removeItem:', error);
        alert('Error inesperado al eliminar el artículo: ' + error.message);
      }
    }

    async function editItem(itemId, newText) {
      console.log('editItem called with itemId:', itemId, 'newText:', newText);
      
      if (!itemId || !newText || newText.trim() === '') {
        console.error('Invalid parameters for editItem:', { itemId, newText });
        throw new Error('El nombre del artículo no puede estar vacío.');
      }

      try {
        const { error } = await supabase
          .from('items')
          .update({ text: newText.trim() })
          .eq('id', itemId)
          .eq('user_id', currentUserId);

        if (error) {
          console.error('Error editing item:', error.message);
          throw new Error('Error al actualizar el artículo en la base de datos.');
        }

        console.log('Item edited successfully:', itemId);
        // Update the list immediately for better UX
        await renderList();
        // Note: renderList() will also be called automatically by the realtime subscription
      } catch (error) {
        console.error('Unexpected error in editItem:', error);
        throw error;
      }
    }

    async function togglePerson(itemId, person) {
      console.log('togglePerson called with itemId:', itemId, 'person:', person);
      
      if (!itemId || !person) {
        console.error('Invalid parameters for togglePerson:', { itemId, person });
        return;
      }

      try {
        const { data: currentItem, error: fetchError } = await supabase
          .from('items')
          .select('*')
          .eq('id', itemId)
          .eq('user_id', currentUserId)
          .single();

        if (fetchError || !currentItem) {
          console.error('Error fetching item for toggle:', fetchError?.message || 'Item not found.');
          return;
        }

        let updateData = {};
        if (person === 'elisa') {
          updateData = { elisa_active: !currentItem.elisa_active, jorge_active: false };
        } else if (person === 'jorge') {
          updateData = { jorge_active: !currentItem.jorge_active, elisa_active: false };
        } else {
          console.error('Invalid person parameter:', person);
          return;
        }

        console.log('Updating item with data:', updateData);

        const { error: updateError } = await supabase
          .from('items')
          .update(updateData)
          .eq('id', itemId)
          .eq('user_id', currentUserId);

        if (updateError) {
          console.error('Error toggling person:', updateError.message);
          return;
        }

        console.log('Person toggle successful for item:', itemId, 'person:', person);
        // Update the list immediately for better UX
        await renderList();
        // Note: renderList() will also be called automatically by the realtime subscription
      } catch (error) {
        console.error('Unexpected error in togglePerson:', error);
      }
    }
    async function clearList() {
      console.log('Clearing shopping list...');
      if (!currentUserId) return;

      // First, clear the UI immediately for better UX
      shoppingList.innerHTML = '';
      emptyListMessage.classList.remove('hidden');
      clearListBtn.disabled = true;
      clearListBtn.classList.add('disabled');

      // Then delete from the database
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('user_id', currentUserId);

      if (error) {
        console.error('Error clearing list:', error.message);
        // If there was an error, re-render the list to show the current state
        await renderList();
        return;
      }
      
      // Hide the modal after successful deletion
      hideModal();
    }

    function showModal() {
      console.log('Showing confirmation modal...');
      confirmationModal.classList.remove('hidden');
      confirmationModal.classList.add('visible');
      confirmationModal.setAttribute('aria-hidden', 'false');
    }

    function hideModal() {
      console.log('Hiding confirmation modal...');
      confirmationModal.classList.remove('visible');
      confirmationModal.setAttribute('aria-hidden', 'true');
      confirmationModal.classList.add('hidden');
    }

    // --- Authentication Functions ---
    async function handleAuth(action) {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        authMessage.textContent = 'Por favor, introduce email y contraseña.';
        authMessage.classList.remove('hidden');
        return;
      }

      try {
        let error = null;
        if (action === 'signin') {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          error = signInError;
        }

        if (error) {
          authMessage.textContent = `Error: ${error.message}`;
          authMessage.classList.remove('hidden', 'success-message');
          authMessage.classList.add('error-message');
        } else {
          emailInput.value = '';
          passwordInput.value = '';
          authMessage.classList.add('hidden');
        }
      } catch (err) {
        authMessage.textContent = `Error inesperado: ${err.message}`;
        authMessage.classList.remove('hidden', 'success-message');
        authMessage.classList.add('error-message');
      }
    }

    // --- UI State Management based on Auth ---
    async function checkAuthAndRender() {
      console.log('checkAuthAndRender: START');
      // Ensure both sections are hidden initially, then reveal based on auth state
      authSection.classList.add('hidden');
      shoppingListSection.classList.add('hidden');
      console.log('checkAuthAndRender: Both sections initially set to hidden.');

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('checkAuthAndRender: Error getting session:', sessionError.message);
          authMessage.textContent = `Error de sesión: ${sessionError.message}. Por favor, intenta de nuevo.`;
          authMessage.classList.remove('hidden', 'success-message');
          authMessage.classList.add('error-message');
          authSection.classList.remove('hidden'); // Show auth section with error message
          console.log('checkAuthAndRender: Showing auth section due to session error.');
          return;
        }

        console.log('checkAuthAndRender: Supabase session data received:', session);

        if (session) {
          currentUserId = session.user.id;
          console.log('checkAuthAndRender: User is authenticated. Showing shopping list section.');
          shoppingListSection.classList.remove('hidden');
          console.log('checkAuthAndRender: shoppingListSection hidden class removed.');
          await renderList(); // Await renderList to ensure items are fetched and displayed
          console.log('checkAuthAndRender: renderList completed for authenticated user.');
          
          // Setup realtime subscription for the authenticated user
          setupRealtimeSubscription();
        } else {
          currentUserId = null;
          console.log('checkAuthAndRender: User is NOT authenticated. Showing authentication section.');
          authSection.classList.remove('hidden');
          console.log('checkAuthAndRender: authSection hidden class removed.');
          
          // Clean up realtime subscription when user is not authenticated
          cleanupRealtimeSubscription();
        }
      } catch (err) {
        console.error('checkAuthAndRender: Unexpected error during session check:', err);
        authMessage.textContent = `Error inesperado al verificar sesión: ${err.message}`;
        authMessage.classList.remove('hidden', 'success-message');
        authMessage.classList.add('error-message');
        authSection.classList.remove('hidden'); // Show auth section with error
        console.log('checkAuthAndRender: Showing auth section due to unexpected error.');
      }
      console.log('checkAuthAndRender: END');
    }

    // --- Initialize SortableJS ---
    new Sortable(shoppingList, {
      animation: 150,
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder
      handle: '.drag-handle', // Specify the drag handle
      onEnd: async function (evt) {
        console.log('SortableJS onEnd event fired.');
        // Recalculate order for all items based on their new DOM position
        const updatedItems = Array.from(shoppingList.children).filter(item => item.tagName === 'LI');
        const itemOrdersToUpdate = [];

        for (let i = 0; i < updatedItems.length; i++) {
          const item = updatedItems[i];
          // Use a float for flexibility in ordering (e.g., 10.0, 20.0, 30.0)
          // This allows inserting items between existing ones without reordering everything
          const newCalculatedOrder = (i + 1) * 10.0; 
          
          // Only update if the order has actually changed to minimize DB writes
          if (parseFloat(item.dataset.order) !== newCalculatedOrder) {
            itemOrdersToUpdate.push({
              id: item.dataset.id,
              order: newCalculatedOrder,
              user_id: currentUserId // Ensure user_id is included for RLS
            });
            item.dataset.order = newCalculatedOrder; // Update DOM data-order immediately
          }
        }

        console.log('Items to update in Supabase:', itemOrdersToUpdate);

        // Update orders in Supabase
        if (itemOrdersToUpdate.length > 0) {
          try {
            const { error } = await supabase.from('items').upsert(itemOrdersToUpdate);
            if (error) {
              console.error('Error updating item order in Supabase:', error.message);
              alert('Error al guardar el nuevo orden de los artículos. La lista podría no estar sincronizada.');
            } else {
              console.log('Item order updated successfully in Supabase.');
              // Note: renderList() will be called automatically by the realtime subscription
            }
          } catch (err) {
            console.error('Unexpected error during Supabase upsert:', err);
            alert('Error inesperado al guardar el nuevo orden. La lista podría no estar sincronizada.');
          }
        } else {
          console.log('No order changes detected or no items to update after drag.');
        }
      },
    });

    // --- Other Event Listeners ---
    addItemBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addItem();
      }
    });

    // Event delegation for shopping list items
    shoppingList.addEventListener('click', (e) => {
      const target = e.target;
      
      // Only handle button clicks
      if (!target.matches('button')) {
        return;
      }

      const listItem = target.closest('li');
      if (!listItem) {
        return;
      }

      const itemId = listItem.dataset.id;
      if (!itemId) {
        console.error('No item ID found for list item');
        return;
      }

      // Handle remove button
      if (target.classList.contains('remove-item-btn')) {
        console.log('Remove button clicked for item:', itemId);
        
        // Remove item directly without confirmation
        removeItem(itemId);
        return;
      }

      // Handle edit button
      if (target.classList.contains('edit-item-btn')) {
        console.log('Edit button clicked for item:', itemId);
        
        // Check if the item is already in edit mode
        if (listItem.querySelector('.edit-input')) {
          // If already in edit mode, just focus the input
          listItem.querySelector('.edit-input').focus();
          return;
        }

        const itemTextSpan = listItem.querySelector('.item-text');
        if (!itemTextSpan) {
          console.error('Error: item-text span not found within list item.');
          return;
        }
        const currentText = itemTextSpan.textContent;

        // Create and set up the edit input
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.classList.add('edit-input');
        editInput.setAttribute('aria-label', `Editar artículo: ${currentText}`);

        // Replace the text span with the input
        listItem.replaceChild(editInput, itemTextSpan);
        editInput.focus();

        // Save function that will be called on blur or Enter
        const saveEdit = async () => {
          const newText = editInput.value.trim();
          
          if (newText === '') {
            // If empty, revert to original text
            listItem.replaceChild(itemTextSpan, editInput);
            return;
          }
          
          try {
            // Update the item in the database
            await editItem(itemId, newText);
            
            // Update the UI with the new text
            itemTextSpan.textContent = newText;
            listItem.replaceChild(itemTextSpan, editInput);
            
          } catch (error) {
            console.error('Error saving edit:', error);
            // On error, revert to the original text
            listItem.replaceChild(itemTextSpan, editInput);
          }
        };

        // Handle Enter key
        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
          }
        });

        // Handle click outside (blur)
        editInput.addEventListener('blur', () => {
          saveEdit();
        });
        
        return;
      }

      // Handle person buttons (Elisa/Jorge)
      if (target.classList.contains('person-btn')) {
        const person = target.dataset.person;
        if (person) {
          console.log('Person button clicked for item:', itemId, 'person:', person);
          togglePerson(itemId, person);
        } else {
          console.error('No person data found for button:', target);
        }
        return;
      }
    });

    clearListBtn.addEventListener('click', showModal);
    confirmDeleteBtn.addEventListener('click', clearList);
    cancelDeleteBtn.addEventListener('click', hideModal);

    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) {
        hideModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && confirmationModal.classList.contains('visible')) {
        hideModal();
      }
    });

    // Auth Event Listeners
    signInBtn.addEventListener('click', () => handleAuth('signin'));

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      checkAuthAndRender();
    });

    // Initial check and render
    await checkAuthAndRender();
    console.log('Initial authentication check and render complete.');

  } catch (error) {
    console.error("An error occurred during application initialization:", error);
    const appDiv = document.getElementById('app');
    if (appDiv) {
      appDiv.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Error crítico al cargar la aplicación. Por favor, revisa la consola para más detalles.</p>';
      appDiv.style.backgroundColor = '#ffebee';
      appDiv.style.border = '1px solid #ef9a9a';
    }
  }
});
