
export const changeTheme = (self:any, currentTheme:number) => {
    let justifyValues = ['flex-start', 'center', 'flex-end']; 
        
    if (currentTheme === 3) {
        document.body.classList.remove(`view-${currentTheme-1}`)
        document.body.classList.remove(`view-${currentTheme}`)
        currentTheme = 0
        
    }
    
    currentTheme++
    document.body.classList.add(`view-${currentTheme}`);
    let viewSwitch = document.querySelector('.change-view') as HTMLDivElement;
    viewSwitch.style.justifyContent = justifyValues[currentTheme - 1]
            
    self.setState({currentTheme})
    disablSoftKeyboard()		
}


//Disable soft keyboard on mibile
export const disablSoftKeyboard = () => {
    let input = document.querySelector('.calculator-input') as HTMLInputElement;
    input.focus();
    
    if(window.matchMedia("(max-width : 980px)").matches){
    
        // Prevent soft keyboard from poping up.
        input.readOnly = true;
    
        setTimeout(() => {
            input = document.querySelector('.calculator-input') as HTMLInputElement;;
            input.readOnly = false;
        });
    }else{

        input.readOnly = false;
    }
}


export const scrollResultsDisplay = ():void => {

    let resultsDisplay = document.querySelector('.results-history-screen') as HTMLDivElement;

    resultsDisplay.scrollTop = resultsDisplay.scrollHeight;
    resultsDisplay.scrollIntoView(false);
}