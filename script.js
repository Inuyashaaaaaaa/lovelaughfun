document.addEventListener("DOMContentLoaded", function() {
    // Function to calculate the total amount
    function calculateTotalAmount() {
        let total = 0;
        const orderedItems = document.querySelectorAll('#ordered-items .card-body p.float-end');
        orderedItems.forEach(function(item) {
            const totalPriceString = item.innerText.split(' ')[0];
            const totalPrice = parseFloat(totalPriceString);
            total += totalPrice;
        });
        return total;
    }

    // Function to update the total price display
    function updateTotalPriceDisplay() {
        const totalPriceElement = document.getElementById('total-price');
        const totalAmount = calculateTotalAmount();
        totalPriceElement.textContent = `${totalAmount.toFixed(2)} PHP`;
    }

    // Function to add "Void Item" option to ordered item card
    function addVoidItemOption(orderedItemCardBody) {
        const voidItemOption = document.createElement('button');
        voidItemOption.classList.add('btn', 'btn-danger',);
        voidItemOption.textContent = 'Void Item';
        voidItemOption.addEventListener('click', function() {
            orderedItemCardBody.parentElement.remove(); // Remove the ordered item card
            // Update the total price display
            updateTotalPriceDisplay();
        });
        orderedItemCardBody.appendChild(voidItemOption);
    }

    // Get the Add to Order buttons
    const addToOrderButtons = document.querySelectorAll('.btn.btn-info');
    
    addToOrderButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Get the parent card of the clicked button
            const parentCard = button.closest('.card-body');
            // Get the product name
            const productName = parentCard.querySelector('b').innerText;
            // Get the quantity
            const quantity = parseInt(parentCard.querySelector('input[name="quantity"]').value);
            // Calculate the total price
            const pricePerItem = parseFloat(productName.split(' - ')[1].split(' ')[0]);
            const totalPrice = pricePerItem * quantity;

            // Loop through existing ordered items to check if the product already exists
            let productExists = false;
            const existingItems = document.querySelectorAll('#ordered-items .card-body');
            existingItems.forEach(function(item) {
                const itemProductName = item.querySelector('p:first-of-type').innerText;
                if (itemProductName === productName) {
                    productExists = true;
                    const existingQuantity = parseInt(item.querySelector('p:nth-of-type(2)').innerText.split(' ')[1]);
                    const newQuantity = existingQuantity + quantity;
                    const existingTotalPrice = parseFloat(item.querySelector('p.float-end').innerText.split(' ')[0]);
                    const newTotalPrice = existingTotalPrice + totalPrice;
                    item.querySelector('p:nth-of-type(2)').innerText = `Qty ${newQuantity} x ${pricePerItem} PHP`;
                    item.querySelector('p.float-end').innerText = `${newTotalPrice.toFixed(2)} PHP`;
                }
            });

            // If the product does not exist, create a new item
            if (!productExists) {
                // Create a new card element for the ordered item
                const orderedItemCard = document.createElement('div');
                orderedItemCard.classList.add('card', 'mt-4');

                const orderedItemCardBody = document.createElement('div');
                orderedItemCardBody.classList.add('card-body');

                // Set the content of the ordered item card
                orderedItemCardBody.innerHTML = `
                    <p>${productName}</p>
                    <p>Qty ${quantity} x ${pricePerItem} PHP</p>
                    <p class="float-end">${totalPrice.toFixed(2)} PHP</p>
                `;

                // Append the ordered item card to the Ordered Items section
                document.querySelector('#ordered-items').appendChild(orderedItemCard);
                orderedItemCard.appendChild(orderedItemCardBody);

                // Add the "Void Item" option to the ordered item card
                addVoidItemOption(orderedItemCardBody);
            }

            // Update the total price display
            updateTotalPriceDisplay();
        });
    });


    // Handle payment
    const payButton = document.getElementById('pay');
    payButton.addEventListener('click', function() {
        const cashInput = document.getElementById('cash');
        const cashAmount = parseFloat(cashInput.value);
        const totalAmount = calculateTotalAmount();

        if (cashAmount >= totalAmount) {
            const change = cashAmount - totalAmount;
            alert(`Payment successful! Change: ${change.toFixed(2)} PHP`);
            clearOrderedItems(); // Optionally clear ordered items after payment
        } else {
            alert('Insufficient amount!');
        }
    });

    // Handle voiding all items
    const voidAllButton = document.getElementById('void-all');
    voidAllButton.addEventListener('click', function() {
        const orderedItemsContainer = document.getElementById('ordered-items');
        orderedItemsContainer.innerHTML = ''; // Clear the content
        // Update the total price display
        updateTotalPriceDisplay();
    });

    // Function to clear ordered items
    function clearOrderedItems() {
        const orderedItemsContainer = document.getElementById('ordered-items');
        orderedItemsContainer.innerHTML = ''; // Clear the content
        // Update the total price display
        updateTotalPriceDisplay();
    }
});
