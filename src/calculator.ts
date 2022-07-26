interface Params {
    leftHandOperand:number
    rigtHandOperand?:number
    percentage?:number,

}

class Calculator {
    readonly leftHandOperand: number;
    readonly rigtHandOperand?: number;
    readonly percentage?: number;

    constructor(params:Params) {
        this.leftHandOperand = params.leftHandOperand || 0;  
        this.rigtHandOperand = params.rigtHandOperand || 0;
        this.percentage = params.percentage;      
        console.log(params)
    }

    percentageOf = (fromNum:number) =>  {
        try {
            let per = this?.percentage || 0            
            return per/100*fromNum
            
        } catch (error) {
            throw new Error("Malformed Expression");
                        
        }
    };

    multiplyByPer = () => {
        let per = this?.percentage || 0;  
            
        return `${per*this.leftHandOperand/100}` 
    };

    devideByPer = () => {
        let per = this?.percentage || 0; 
        return `${this.leftHandOperand/per*100}`
    };

    addByPer = () => {
        let per = this?.percentage || 0 
        return `${per/100*this.leftHandOperand + this.leftHandOperand}`
    };

    substractByPer = () => {
        let per = this?.percentage || 0 
             
        return `${this.leftHandOperand - this.leftHandOperand/per}`
        
    }

    addToPer = () => {
        //let b = per/100
    }

    subractToPer = () => {

    }

    multiplyToPer = () => {

    }

    divideToPer = () => {

    }


    getResults = (operator:string):string => {
        switch (operator) {
            case '+':
                return this.addByPer();
                
            case '-':
                return this.substractByPer();

            case 'x':
                return this.multiplyByPer();

            case '/':
                return this.devideByPer();
        
            default:
                return '';
        }
        
    }
}

export default Calculator;