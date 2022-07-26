import React from "react";
import * as Icon from 'react-feather';

interface Results {
	expression:string,
	results:string,
}

interface Props {
	handleFormChange:Function,
    processResults:Function,
	handleSubmit:Function,
	changeTheme:Function,
    expression:string,
	result_history:Results[],
	error:string,
	calculated:boolean,
	
}

const CalcTemplate = (props:Props) => {
	let iconSize:number = 15;
	let result_history = props.result_history;
	
	if (window.matchMedia("(min-width : 980px)").matches) {
		iconSize = 30;
	} 

    return (
        <div className="calculator-box">
			<header className="header-box">
				<div className="title">
					<b>CALCULATOR</b>
				</div>

				<div className="theme-change-box">
					<b className="theme-title">THEME</b>
					<div className="theme-contents">
						<div className="theme-number">
							<div>1</div>
							<div>2</div>
							<div>3</div>
						</div>
						<div className="switch-view">
							<div onClick={() => props.changeTheme()} className="ball"></div>
						</div>
					</div>
				</div>
				
			</header>

			<section className="display-screen container">
				<div className="results-history-screen">
					{result_history.map((value, key)=>(
						<ul key={key} className="results-history">
							<li className="expression">{value.expression}</li>
							<li className="equality">=</li>
							<li className="results">
								<span>{value.results}</span>
							</li>
						</ul>
					))}
				</div>
				
				<form onSubmit={(e) => props.handleSubmit(e)} 
					className="calculator-input-form">
					<div className="calculator-input-box">
						<input
							id="calculator-input"
							className="calculator-input"
						   	autoFocus={true} 
							onChange={(e) =>props.handleFormChange(e)}
						   	value={props.expression}
						   	type="text"
						/>
					</div>
				</form>
				<div className="error-message">
					<ul>
						<li>{props.error}</li>
					</ul>
				</div>
			</section>

            <section className="calculator__buttons">
      			<div className="calculator__btn" data-value="7">7</div>
     			<div className="calculator__btn" data-value="8">8</div>
      			<div className="calculator__btn" data-value="9">9</div>
      			<div className="calculator__btn calculator__btn--del" data-value="delete">
				    <button className="operator-btn btn-sm delete-btn">
            			<Icon.Delete 
							className="calculator-btn-icon"
							data-value="delete" 
							size={iconSize}
						/>
        			</button>
      			</div>
      		
				<div className="calculator__btn" data-value="4">4</div>
     			<div className="calculator__btn" data-value="5">5</div>
      			<div className="calculator__btn" data-value="6">6</div>
      			<div className="calculator__btn" data-value="+">
				    <button className="operator-btn btn-sm">
            			<Icon.Plus className="calculator-btn-icon" data-value="+" size={iconSize}/>
        			</button>
				</div>
      			<div className="calculator__btn" data-value="1">1</div>
     		 	<div className="calculator__btn" data-value="2">2</div>
      			<div className="calculator__btn" data-value="3">3</div>
      			<div className="calculator__btn" data-value="-">
				    <button className="operator-btn btn-sm">
            			<Icon.Minus className="calculator-btn-icon" data-value="-" size={iconSize}/>
        			</button>
				</div>
      			<div className="calculator__btn" data-value=".">.</div>
      			<div className="calculator__btn" data-value="0">0</div>
      			<div className="calculator__btn" data-value="/">
				    <button className="operator-btn btn-sm">
            			<Icon.Divide className="calculator-btn-icon" data-value="/" size={iconSize}/>
        			</button>
				</div>
      			<div className="calculator__btn" data-value="x">
				    <button className="operator-btn btn-sm">
            			<Icon.X className="calculator-btn-icon" data-value="x" size={iconSize}/>
        			</button>
				</div>
      			<div className="calculator__btn calculator__btn--reset" data-value="reset">
        			RESET
     			</div>
      			<div className="calculator__btn calculator__btn--result" data-value="result">
        			=
      			</div>
    		</section>
        </div>
        
    );
};

export default CalcTemplate;

/*

*/ 


/*

			*/