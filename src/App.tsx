import React, { Component } from 'react';
import './App.css';
import CalcTemplate from './templates'
import Calculator from './calculator';

interface Props {
	
	
}


interface Results {
	expression:string,
	results:string,
}

  
interface State {
	error:string,
	currentTheme:number,
	resultHistory:Results[],
	expression:string,
	calculated:boolean,
}

class App extends Component<Props, State> {
		
	readonly state : State = {
		error: '',
		resultHistory : [],
		expression : "10+10",
		calculated : false,
		currentTheme:1,

	}
	constructor(props:Props){
		super(props)
	};

	readonly self = this;


	static getDerivedStateFromError = (error:any) => {
		//console.log(error)

	}

	componentDidCatch = (error: any) => {
		//console.log(error)
	}

	componentDidMount = () => {
		this.disablSoftKeyboard()
		const allBtns = document.querySelector('.calculator-buttons') as HTMLDivElement;
				
		allBtns?.addEventListener('click', this.handleKeyboard)
				
		let currentTheme = this.state.currentTheme;
		document.body.classList.add(`view-${currentTheme}`);
			
	}

	// Swicth theme and keep input box focused.
	changeTheme = () => {
		let justifyValues = ['flex-start', 'center', 'flex-end']; 
		let currentTheme = this.state.currentTheme;
		
		if (currentTheme === 3) {
			document.body.classList.remove(`view-${currentTheme-1}`)
			document.body.classList.remove(`view-${currentTheme}`)
			currentTheme = 0
			
		}
		
		currentTheme++
		document.body.classList.add(`view-${currentTheme}`);
		let viewSwitch = document.querySelector('.change-view') as HTMLDivElement;
		viewSwitch.style.justifyContent = justifyValues[currentTheme - 1]
				
		this.setState({currentTheme})
		const input = document.querySelector('.calculator-input') as HTMLInputElement;
		input.focus();
	}

	//Disable soft keyboard on mibile
	disablSoftKeyboard = () => {
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
	
	handleFormChange = (e: { preventDefault: () => void; target: { [x: string]: any; }; }) => {
		if (e) e.preventDefault()
		this.disablSoftKeyboard();
	
		let data:string = e.target['value']
		
		if(data.length === 0){
			this.setState({calculated:false})
		}

		this.setState({expression:data, error:''})
	}; 

	// Process results when Enter key is pressed.
	handleSubmit = (e:any) => {
		e.preventDefault();
		this.processResults();
	};

	// Do calculations on current expression. 
	processResults = (expression?:string) => {
		
		if (!expression) {
			expression = this.state.expression;
		}

		expression = expression.replaceAll(/\s/g, "");
		expression = expression.replaceAll('x', "*")
		expression = expression.replaceAll('X', "*")
		let results:string = '';

		let isValid = this.isValidExpression(expression)
		if(!isValid) {
			this.handleErrors()
		}

		if (expression && !expression.includes('%')) {
			
			console.log(expression)
			results = results += `${expression}`;	
			return this.setResults(results)		
		}

		// If we can still get here, means expression contain percentage sign.
		// Expression with involve complex calculation login, so lets take care of them.
		
		let operator:string = '';
		let operand1:string = '';
		let operand2:string = '';
		let decimalVal1:number = 0;
		let decimalVal2:number = 0;
		
		let executableStr:string = '';
	
		for (let index = 0; index < expression.length; index++) {
			const element = expression[index];

			if (this.isSymbol(element) && element !== '%') {
				operator = `${element}`
			}
			
			
			if(element === '%'){
				
				if (!decimalVal1 && !operator) {
					const Calc = new Calculator(
						{
							leftHandOperand:1,
							percentage:Number(operand1.replaceAll("(", ""))
						}
					);
										
					decimalVal1 = Calc.percentageOf(1)
					results = `${decimalVal1}`;
					
				}else if(!decimalVal2){
					
					const calcParams = {
						leftHandOperand:decimalVal1 || Number(operand1),
						percentage:Number(operand2)
					}

					const Calc = new Calculator(calcParams);
					results = Calc.getResults(operator)
					decimalVal2 = parseFloat(results);
				}		
										
			}else if(!decimalVal1 && !this.isSymbol(element) && !operator){
				operand1 = operand1 += `${element}`
				
			}else if(!this.isSymbol(element)){
							
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
			
				this.setResults(results, 1)
			}
		}
	};

	isValidExpression = (expression:string):boolean => {
		let end = expression.length - 1; 
		if (this.isSymbol(expression[end])) {
			return false
												
		}

		return true
	};

	handleErrors = () => {
		let error:string = "Malformed Expression"
		this.setState({error});

	};

	isSymbol = (element:string):boolean => {
		let symbols:string[] = ['+','-', 'x', '=', '/', '*'];
		return symbols.includes(element)
	};

	setResults = (expression:string, format:number = 0) => {
		
		try {
			let results = eval(expression)?.toFixed(format);
			
			const resultHistory = this.state.resultHistory
			
			resultHistory.push({expression, results})
					
			this.setState({resultHistory, expression:results, calculated:true})

			// Scroll the display screen after updating results few millisecond afer. 
			setTimeout(() => {
				this.scrollResultsDisplay()
			}, 100);
			

		} catch (error) {
			this.handleErrors()
		}
	};

	scrollResultsDisplay = () => {

		let resultsDisplay = document.querySelector('.results-history-screen') as HTMLDivElement;
	
		resultsDisplay.scrollTop = resultsDisplay.scrollHeight;
		resultsDisplay.scrollIntoView(false);
	}

	//On page keyboard handler.
	public handleKeyboard = (e: any) => {
		let clicked = e?.target
		this.disablSoftKeyboard()

		if (clicked?.classList.contains("calculator-btn") || 
			clicked.classList.contains('calculator-btn-icon')) {

			let value = clicked.dataset.value;
						
			if (value === 'result') {
				this.processResults()
				
			}else if(value === 'reset') {
				this.setState({expression:'', error:''});

			}else if(value === 'delete'){
				this.deleteFromExpression();

			}else{
				this.insertExpression(value)
			}
		}

	}

	// Track cursor position and insert carecter in.
	insertExpression = (value:string) => {
		const input =  document.querySelector('.calculator-input') as HTMLInputElement;
		
		let start:number = input.selectionStart || 0;
		let end:number = input.selectionEnd || 0;
	
		let selectionMode:SelectionMode = 'end';
		input.setRangeText(`${value}`, start, end, selectionMode)
		this.setState({expression:input.value, error:''})

	};

	//On page key delete handler.. 
	deleteFromExpression = () => {
		const input =  document.querySelector('.calculator-input') as HTMLInputElement;
		
		let expressionArray:string[] =  Array.from(input.value)

		if (expressionArray.length) {
			let start:number = input.selectionStart || 0;
			expressionArray.splice(start-1, 1);
	
			let  expression = expressionArray.join('')
		
			this.setState({expression})
		}

	}

	render(): React.ReactNode {
		const props = {
			...this.state,
			handleFormChange: this.handleFormChange.bind(this),
			handleSubmit :   this.handleSubmit.bind(this),
			processResults: this.processResults.bind(this),
			changeTheme: this.changeTheme.bind(this),
			disablSoftKeyboard : this.disablSoftKeyboard.bind(this),
		}

		return (
    		<div className="calculator-container container">
				<CalcTemplate {...props}/>      		
    		</div>
  		);
	}
}

export default App;
