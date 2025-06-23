let areaForDrawing = document.querySelector('.drawing-area');
let erasingButton = document.querySelector('#regenerate-board')
let modeSelect = document.querySelector('#drawing-mode-select');
let changeGridBlock = document.querySelector('.change-grid')
let popoutButton = document.querySelector('.popout');
let gridInfoBlock = document.querySelector('.grid-info');
let isClicked = false;

function getRandomRGBValue() {
    return Math.floor(Math.random() * 255);
}

const interactWithBlock = (element) => {
    element.classList.toggle('active-element');
    if (!element.style.backgroundColor) {
        element.style.backgroundColor = `rgb(${getRandomRGBValue()}, ${getRandomRGBValue()} ,${getRandomRGBValue()})`;
    }
    let opacity = element.style.opacity ? parseFloat(element.style.opacity) : 0;
    if (opacity <= 0.9) {
        element.style.opacity = `${opacity + 0.1}`;
    }
};

const interactWithBlockViaEvent = (event) => {
    interactWithBlock(event.target);
    event.target.classList.toggle('active-element');
};


const dragElementInteraction = (event) => {
    console.log(isClicked);
    if (isClicked) {
        interactWithBlockViaEvent(event);
        event.target.style.cursor = 'pointer';
    } else {
        event.target.style.cursor = 'default';
    }
}

const interactUsingDragging = (element) => {
    isClicked = true;
    if (element !== null) {
        interactWithBlock(element);
    }
};

const getColumnsAndRowsNumber = () => {
    let columnsNumber = sessionStorage.getItem('columnsNumber') ? parseInt(sessionStorage.getItem('columnsNumber')) : 16;
    let rowsNumber = sessionStorage.getItem('rowsNumber') ? parseInt(sessionStorage.getItem('rowsNumber')) : 16;
    return [columnsNumber, rowsNumber];
}

const regenerateNewGrid = () => {
    areaForDrawing.innerHTML = '';
    [columnsNumber, rowsNumber] = getColumnsAndRowsNumber();
    gridInfoBlock.textContent = `${columnsNumber} X ${rowsNumber}`;
    generateTemplate(columnsNumber, rowsNumber);
};

const handlerSelectChange = (event) => {
    const type = event.target.value;
    labelBlockWithEvents(type);
};

const resetEvents = () => {
    areaForDrawing.childNodes.forEach((el) => {
        let elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
    });
}
const labelBlockWithEvents = (type) => {
    resetEvents();
    areaForDrawing.childNodes.forEach((el) => {
        switch (type) {
            case 'hovering':
                el.addEventListener('mouseenter', interactWithBlockViaEvent)
                break;
            case 'clicking':
                el.addEventListener('click', interactWithBlockViaEvent);
                break;
            case 'dragging':
                el.addEventListener('mousedown', (e) => {
                    interactUsingDragging(el)
                    e.preventDefault()
                })
                el.addEventListener('mouseenter', dragElementInteraction);
                break;
        }
    })
};

function generateTemplate(columnsNumber = 16, rowsNumber = 16) {
    let modeType = modeSelect.value;
    for (let i = 0; i < columnsNumber; i++) {
        for (let j = 0; j < rowsNumber; j++) {
            let block = document.createElement('div');
            block.style.width = `${areaForDrawing.getBoundingClientRect().width / columnsNumber}px`
            block.style.height = `${areaForDrawing.getBoundingClientRect().width / rowsNumber}px`
            block.classList.add('drawing-block');
            areaForDrawing.appendChild(block);
        }
    }
    labelBlockWithEvents(modeType);
}

const operateWithErrorBlock = (message) => {
    let messageText = message.charAt(0).toUpperCase() + message.substring(1);
    let errorsArea = document.querySelector('#errors-block');
    if (!errorsArea) {
        let errorBlock = document.createElement('span');
        errorBlock.id = 'errors-block';
        errorBlock.classList.add('errors-block');
        errorBlock.textContent = messageText;
        changeGridBlock.appendChild(errorBlock);
    } else {
        errorsArea.textContent = messageText;
    }
}

const deleteErrorBlock = () => {
    let errorsArea = document.querySelector('#errors-block');
    if (errorsArea) {
        errorsArea.remove();
    }
};

const invokePromptNewGridSize = () => {
    let [columns, rows] = inputGridInfo();
    if (validateInputValues(columns, rows)) {
        sessionStorage.setItem('columnsNumber', `${columns}`);
        sessionStorage.setItem('rowsNumber', `${rows}`);
        regenerateNewGrid()
    }

};

const inputGridInfo = () => {

    const columns = parseInt(prompt('Enter column size(max is 100): '));

    const rows = parseInt(prompt('Enter row size(max is 100): '));

    return [columns, rows];
};

const validateInputValues = (columns, rows) => {
    if (isNaN(columns) || isNaN(rows)) {
        operateWithErrorBlock('Please enter a input as one of the number within [1;100] array');
        return false;
    } else if (columns < 1 || columns > 100 || rows < 1 || rows > 100) {
        operateWithErrorBlock('You need to decrease your declared size to max 100 and min 1!!');
        return false;
    } else {
        deleteErrorBlock();
        return true;
    }

}
document.addEventListener('DOMContentLoaded', regenerateNewGrid);

modeSelect.addEventListener('change', handlerSelectChange);
popoutButton.addEventListener('click', invokePromptNewGridSize);
erasingButton.addEventListener('click', regenerateNewGrid);

document.addEventListener('mouseup', () => {
    isClicked = false;
})