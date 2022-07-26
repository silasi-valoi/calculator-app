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
	result_history:Results[],
	expression:string,
	calculated:boolean,
}

class App extends Component<Props, State> {
		
	readonly state : State = {
		error: '',
		result_history : [],
		expression : "10+10",
		calculated : false,
		currentTheme:1,

	}
	constructor(props:Props){
		super(props)
	};

	readonly self = this;

	public allBtns = document.getElementsByClassName('calculator__btn');
	public displayScreen = document.querySelector('.results');
	

	static getDerivedStateFromError = (error:any) => {
		console.log(error)

	}

	componentDidCatch = (error: any, info: any) => {
		console.log(error)
	}

	componentDidMount = () => {
		this.disablSoftKeyboard()
		let allBtns = document.querySelector('.calculator__buttons');
		
		allBtns?.addEventListener('click', this.handleCalculations)
		document.addEventListener('resize', this.handleResize)
		let currentTheme = this.state.currentTheme;
	
		document.body.classList.add(`theme-${currentTheme}`);
			
	}

	changeTheme = () => {
		let themeSwitch = document.querySelector('.switch-view') as HTMLDivElement;
		let justifyValues = ['start', 'center', 'end']; 
		let currentTheme = this.state.currentTheme;
		console.log("From State: ",currentTheme)
		if (currentTheme === 3) {
			document.body.classList.remove(`theme-${currentTheme-1}`)
			document.body.classList.remove(`theme-${currentTheme}`)
			currentTheme = 0
			
		}

		console.log(currentTheme)
		
		currentTheme++
		console.log("After incremation",currentTheme)
		document.body.classList.add(`theme-${currentTheme}`);
		themeSwitch.style.justifyContent = justifyValues[currentTheme - 1]
				
		this.setState({currentTheme})

	}

	disablSoftKeyboard = () => {
		if(window.matchMedia("max-width : 980px)").matches) return;

		let inputVal = document.getElementById('calcutator-input') as HTMLInputElement;
		
		if(inputVal){
			inputVal.readOnly = true;
			inputVal.focus();

			setTimeout(function(){
				inputVal = document.getElementById('calcutator-input') as HTMLInputElement;
				if(inputVal) inputVal.readOnly = false;
			});
		}

	}

	handleFormChange = (e: { preventDefault: () => void; target: { [x: string]: any; }; }) => {
		if (e) e.preventDefault()
		this.disablSoftKeyboard();
	
		let data:string = e.target['value']
		console.log(e.target.selectionStart)
		console.log(e.target.selectionEnd)
		console.log(`FormData: ${data}`)
		if(data.length === 0){
			this.setState({calculated:false})
		}

		this.setState({expression:data, error:''})
	} 

	handleSubmit = (e:any) => {
		e.preventDefault();
		console.log(e)

	}

	processResults = (expression?:string) => {
		console.log("   ")
		
		console.log(`Current Expression ${this.state.expression}`)
		if (!expression) {
			expression = this.state.expression;
		}

		expression = expression.replaceAll(/\s/g, "");
		let results:string = '';

		let isValid = this.isValidExpression(expression)
		if(!isValid) {
			this.handleErrors()
		}

		if (expression && !expression.includes('%')) {
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
		let hasExecutable:boolean = false;
	
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
					console.log(`First Percentage ${operand1} of ${1} is: ${decimalVal1}`)

				}else if(!decimalVal2){
					
					const calcParams = {
						leftHandOperand:decimalVal1 || Number(operand1),
						percentage:Number(operand2)
					}

					const Calc = new Calculator(calcParams);
					results = Calc.getResults(operator)
					decimalVal2 = parseFloat(results);

					console.log(`Second percentage ${operand2} of ${decimalVal1} is: ${results}`)
					
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
					console.log(executableStr)
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

	}

	handleErrors = () => {
		let error:string = "Malformed Expression"
		this.setState({error});

	}

	isSymbol = (element:string):boolean => {
		let symbols:string[] = ['+','-', 'x', '=', '/', '*'];
		return symbols.includes(element)
	}

	setResults = (expression:string, format:number = 0) => {
		
		try {
			let results = eval(expression)?.toFixed(format);
			console.log(`RESULTS OF ${results} IS: ${expression}`)
			console.log(" ")
			const result_history = this.state.result_history
			
			result_history.push({expression, results})
					
			this.setState({result_history, expression:results, calculated:true})
			
		} catch (error) {
			this.handleErrors()
			throw new Error("Malformed Expression");
		}
	

	};

	/**
	 * a
	 */
	 public handleCalculations = (e: any) => {
		let clicked = e?.target

		const input = document.getElementById('calculator-input') as HTMLInputElement;
		this.disablSoftKeyboard()

		console.log(clicked)
	
		console.log(clicked.classList.contains('calculator-btn-icon'))
	
		if (clicked?.classList.contains("calculator__btn") || 
			clicked.classList.contains('calculator-btn-icon')) {

			let value = clicked.dataset.value;
			
			console.log(`Value: ${value}`,typeof value)
			if (value === 'result') {
				return	this.processResults()
				
			}else if(value === 'reset') {
				this.setState({expression:'', error:''})
			}else if(value === 'del'){

			}else{

				console.log("Clicked btn ", value);
				let result = document.querySelector('.results');
				
				let start:number = input.selectionStart || 0;
				let end:number = input.selectionEnd || 0;
				let selectionMode:SelectionMode = 'end';
				input.setRangeText(`${value}`, start, end, selectionMode)

				console.log('Contents: ', input.value)
				this.setState({expression:input.value, error:''})
				
			}
		}

	}

	handleResize(event:any) {
		this.disablSoftKeyboard()
		console.log(event)
		alert("I'm openning the soft keyboard.")
		throw new Error('Method not implemented.');
	}

	keyCalcution (this: Document, event: KeyboardEvent) {
		
				
		let pressedKey = null;
		//let operations = this.state['operations'];
		let result = document.querySelector('.results');
		
		console.log(result?.textContent)
		let text:any = result?.textContent
		//let calc:string = result?.textContent

		
		if (event) {
			pressedKey = event.key;
			//this.setState({operations:text})
			
			console.log(event.key)
			if (pressedKey === '%'){
				//console.log("Calculating percetage")
			}
			//throw new Error('Method not implemented.');
		}
	}


	render(): React.ReactNode {
		const props = {
			...this.state,
			handleFormChange: this.handleFormChange.bind(this),
			handleSubmit :   this.handleSubmit.bind(this),
			processResults: this.processResults.bind(this),
			changeTheme: this.changeTheme.bind(this),
		}

		return (
    		<div className="calculator-container container">
				<CalcTemplate {...props}/>      		
    		</div>
  		);
	}
}

export default App;
