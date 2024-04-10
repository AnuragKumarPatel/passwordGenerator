const inputSlider = document.querySelector("[deta-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")

const datapasswrodDisplay = document.querySelector("[data-passworddisplay]")
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheak = document.querySelector("#uppercase")
const lowercaseCheak = document.querySelector("#lowercase")
const numbersCheak = document.querySelector("#numbers")
const symbolsCheak = document.querySelector("#symbols")
const dataindicator = document.querySelector("[data-indicator]")
const generateBtn = document.querySelector("#generateButton")
const allCheakBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '[\][!@#$%^&*()_+~\|}{';


//initially
let password = "";
let passwordLength = 10;
let cheakCount = 0;
handleSlider();
//set strength circle color grey
setIndicator("#ccc");

//set password length according slider
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
}

function setIndicator(color) {
    dataindicator.style.backgroundColor = color;
    //shadow
}

function getRandIngeger(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandIngeger(0, 9)
}

function generateLowerCase() {
  return  String.fromCharCode(getRandIngeger(97, 123));
}

function generateUpperCase() {
  return  String.fromCharCode(getRandIngeger(65, 91));
}

function generateSymbols() {
    const randum = getRandIngeger(0, symbols.length)
    return symbols.charAt(randum);
}

function calcStrngth() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheak.checked) hasUpper = true;
    if (lowercaseCheak.checked) hasLower = true;
    if (numbersCheak.checked) hasNum = true;
    if (symbolsCheak.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(datapasswrodDisplay.value);
        copyMsg.innerText = "copied";
    }

    catch(e){
        copyMsg.innerText = 'failed';
    }

    copyMsg.classList.add("active")
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);

}

function shufflePassword(array) {
    //Fisher yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChage() {
    cheakCount = 0;
    allCheakBox.forEach((checkbox) => {
        if (checkbox.checked)
            cheakCount++;
    });

    if (passwordLength < cheakCount) {
        passwordLength = cheakCount;
        handleSlider();
    }
}

allCheakBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChage);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
   
});


copyBtn.addEventListener('click', () => {
    if (datapasswrodDisplay.value)
        copyContent();
});

generateBtn.addEventListener("click", () => {
    //none of the checkbox are selected

    if (cheakCount == 0)
        return;

    if (passwordLength < cheakCount) {
        passwordLength = cheakCount;
        handleSlider();
    }

    //let's start the journey to find new password
    console.log('Straingth the journey')
    //remove password
    password = "";

    //let's put the stuff mentioned by cheakbox

    // if(uppercaseCheak.checked){
    //     password+= generateUpperCase();
    // }

    // if(lowercaseCheak.checked){
    //     password+= generateLowerCase();
    // }

    // if(numbersCheak.checked){
    //     password+= generateRandomNumber();
    // }

    // if(symbolsCheak.checked){
    //     password+= generateSymbols();
    // }

    let funcArr = [];

    if (uppercaseCheak.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheak.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheak.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheak.checked)
        funcArr.push(generateSymbols);

    //cumpulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("compulsory addtition")
    
    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandIngeger(0, funcArr.length);
        console.log("randIndex" + randIndex)
        password += funcArr[randIndex]();
    }
    console.log("remaining addtition")
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log(password);
    //show in ui 
    datapasswrodDisplay.value = password;
    console.log('UI is done')
    //calculate strangth
    calcStrngth();
});