interface Params {
    left:number
    right?:number
    percentage?:number,

}

class Calculator {
    private left: number = 0;
    private right?: number = 0;
    private operator: string = '';
    readonly percentage?: number = undefined;
    protected memory:number = 0;

    readonly operators:string[] = ['+','-', 'x', '=', '/', '*']

    constructor() {
               
    }

    isOperator = (value:string):boolean => {
        return this.operators.indexOf(value) >= 0;
    }

    processDigit = (value:string) => {

    }

    processOperator = (value:string) => {

    }

    evaluate = () => {

    }

    handlePerCalculation = (self:any, expression:string) => {
            let results:string = ''
            let operator:string = '';
            let operand1:string = '';
		    let operand2:string = '';
		    let decimalVal1:number = 0;
		    let decimalVal2:number = 0;
		
		    let executableStr:string = '';

        for (let index = 0; index < expression.length; index++) {
            
			const element = expression[index];

			if (this.isOperator(element) && element !== '%') {
				operator = `${element}`
			}
			
			
			if(element === '%'){
				
				if (!decimalVal1 && !operator) {
					
										
					decimalVal1 = this.percentageOf(Number(operand1), 1)
					results = `${decimalVal1}`;
					
				}else if(!decimalVal2){
					
					results = this.getResults(operator, Number(operand2))
					decimalVal2 = parseFloat(results);
				}		
										
			}else if(!decimalVal1 && !this.isOperator(element) && !operator){
				operand1 = operand1 += `${element}`
				
			}else if(!this.isOperator(element)){
							
				operand2 = operand2 += `${element}`;
				
				if (executableStr && results){
					results = executableStr += `${element}`
				}

			}else if (decimalVal2 && expression.includes(')')) {
				executableStr = executableStr += `${decimalVal2}${element}`
			}
			
			if(decimalVal1 && operand2){
				if (!executableStr) {
					results = executableStr += `${decimalVal1}${operator}${operand2}`
				}
			}
		
			if (results) {
			
				self.setResults(results, 1)
			}
		}
    }

    handleChar = (char:string) => {
        if (char === 'result') {
            this.evaluate()
            
        }else if(this.isOperator(char)){
            this.operator = char;

        }else if(char === 'reset') {

        }else if(char === '%') {
                                    
        }else {
            if (this.operator){
                this.right = Number(char)
            }else{
                this.left = Number(char)
            }
        }
    }

    percentageOf = (percentage:number, fromNum:number) =>  {
        try {
            let current = percentage/100*fromNum;
            this.left = current;
            return current;
            
        } catch (error) {
            throw new Error("Malformed Expression");
                        
        }
    };

    multiplyByPer = (percentage:number) => {
                   
        return `${percentage*this.left/100}` 
    };

    devideByPer = (percentage:number) => {
         
        return `${this.left/percentage*100}`
    };

    addByPer = (percentage:number) => {
        return `${percentage/100*this.left + this.left}`
    };

    substractByPer = (percentage:number) => {
                    
        return `${this.left - this.left/percentage}`
        
    }

    getResults = (operator:string, percentage:number):string => {
        switch (operator) {
            case '+':
                return this.addByPer(percentage);
                
            case '-':
                return this.substractByPer(percentage);

            case 'x':
                return this.multiplyByPer(percentage);

            case '/':
                return this.devideByPer(percentage);
        
            default:
                return '';
        }
        
    }
}

export default Calculator;