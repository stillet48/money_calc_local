const generateId = () => `pos${Math.round(Math.random()*1e8).toString(16)}`;

const totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.getElementById('form'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount');

let dbOperation =JSON.parse(localStorage.getItem('calc')) || [];

if (localStorage.getItem('calc')){
    dbOperation = JSON.parse(localStorage.getItem('calc'));
}

const renderOperation = (operation) => {

    const className = operation.amount < 0 ?
        'history__item-minus' :
        'history__item-plus' ;
    
    const listItem = document.createElement('li');
    listItem.classList.add('history__item');
    listItem.classList.add(className);

    listItem.innerHTML = `${operation.description}
        <span class="history__money">${operation.amount} ₽</span>
        <button class="history_delete" data-id="${operation.id}">x</button>
    `;

    historyList.append(listItem);

};

const updateBalance = () =>{
    
    const resultIncome = dbOperation
        .filter((i) => i.amount > 0)
        .reduce((res, i) => res + i.amount, 0);

    const resultExpenses = dbOperation
        .filter((i) => i.amount < 0)
        .reduce((res, i) => res + i.amount, 0);

    totalMoneyIncome.textContent = resultIncome;
    totalMoneyExpenses.textContent = resultExpenses;
    totalBalance.textContent = resultExpenses + resultIncome;
};

const deleteItem = (event) => {
    if (event.target.classList.contains('history_delete')){
        
        dbOperation = dbOperation
            .filter(operation => operation.id !== event.target.dataset.id);
            
        
        init();
    }
    
}

const init = () => {
    historyList.textContent = '';
    dbOperation.forEach(renderOperation);
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dbOperation));
}

historyList.addEventListener('click', deleteItem);

form.addEventListener('submit', (event) => {
    
    //запрет браузеру стандартных действий (в данном случае перезагрузка страницы)
    event.preventDefault();

    const operationNameValue = operationName.value;
    const operationAmountValue = operationAmount.value;

    operationName.style.borderColor = '';
    operationAmount.style.borderColor = '';

    if (operationAmountValue && operationNameValue){
        
        const newDbElement = {
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmountValue,
        };

        dbOperation.push(newDbElement);

        operationName.value = '';
        operationAmount.value = '';
    }else{
        if(!operationNameValue) operationName.style.borderColor = 'red';
        if(!operationAmountValue) operationAmount.style.borderColor = 'red';
    }
    init();
});


init ();