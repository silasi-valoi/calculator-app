import React, { ChangeEvent, Component } from 'react';
import './App.css';
import CalcTemplate from './templates'
import * as calcDisplay from './display';
import Calculator from './calculator';
import {State} from './types';


class App extends Component<any, State> {
		
	readonly state : State = {
		error: '',
		resultHistory : [],
		expression : "",
		currentTheme:1,

	}

	readonly self = this;


	static getDerivedStateFromError = (error:any) => {
		//console.log(error)

	}

	componentDidCatch = (error: any) => {
		//console.log(error)
	}

	componentDidMount = () => {
		calcDisplay.disablSoftKeyboard()
		console.log(eval('1+0.1*2'))
		
		const allBtns = document.querySelector('.calculator-buttons') as HTMLDivElement;
				
		allBtns?.addEventListener('click', this.handleKeyPress)
				
		let currentTheme = this.state.currentTheme;
		document.body.classList.add(`view-${currentTheme}`);
			
	}

	// Swicth theme and keep input box focused.
	changeTheme = () => {
		calcDisplay.changeTheme(this, this.state.currentTheme)
			
	}

	
	readonly handleFormChange = (e:ChangeEvent<HTMLInputElement>) => {
		if (e) e.preventDefault()
		calcDisplay.disablSoftKeyboard();
	
		let data:string = e.target['value']
		this.setState({expression:data, error:''})
	}; 

	// Process results when Enter key is pressed.
	handleSubmit = (e:any) => {
		e.preventDefault();
		this.processResults();
	};

	// Do calculations on current expression. 
	processResults = (expression?:string) => {
		/*
			Do calculation on current expression
		*/
		
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
		
		
		const Calc = new Calculator();
		Calc.handlePerCalculation(this, expression)
	
		
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
		return ['+','-', 'x', 'X', '=', '/', '*'].indexOf(element) >= 0;
	};

	setResults = (expression:string, format:number = 0) => {
		
		try {
			let results = eval(expression)?.toFixed(format);
			
			const resultHistory = this.state.resultHistory
			
			resultHistory.push({expression, results})
					
			this.setState({resultHistory, expression:results})

			// Scroll the display screen after updating results few millisecond afer. 
			setTimeout(() => {
				calcDisplay.scrollResultsDisplay()
			}, 100);
			

		} catch (error) {
			this.handleErrors()
		}
	};

	

	//On page keyboard handler.
	public handleKeyPress = (e: any) => {
		let htmlElement = e?.target
		calcDisplay.disablSoftKeyboard()
				
		const value = this.getElementValue(htmlElement)

		if (value === 'result') {
			this.processResults()
				
		}else if(value === 'reset') {
			this.setState({expression:'', error:''});

		}else if(value === 'delete'){
			this.deleteFromExpression();

		}else{
			this.insertExpression(value);
		
		}
		

	}

	getElementValue = (element:any): string => {
		if(!element) return "";

		let classList = element.classList

		if (classList.contains("calculator-btn") ||
		    classList.contains("operator-btn") ||
			classList.contains("calculator-btn-icon")) {
			return element.dataset.value;
			
		} 
	
		element = element.parentElement;
		
		if(element) {
			return element.dataset.value;			
		}

		return "";
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
			disablSoftKeyboard : calcDisplay.disablSoftKeyboard,
		}

		return (
    		<div className="calculator-container container">
				<CalcTemplate {...props}/>      		
    		</div>
  		);
	}
}

export default App;
