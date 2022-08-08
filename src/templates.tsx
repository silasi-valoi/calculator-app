import React from "react";
import * as Icon from 'react-feather';
import {Props} from './types';


const CalcTemplate = (props:Props) => {
	let iconSize:number = 17;
	let resultHistory = props.resultHistory;
	
	if (window.matchMedia("(min-width : 980px)").matches) {
		iconSize = 30;
	} 

    return (
        <div className="calculator-box">
			<header className="header-box d-flex">
				<div className="calculator-title">
					<b>CALCULATOR</b>
				</div>

				<div className="change-view-box d-flex">
					<b className="view-change-title">THEME</b>
					<div className="change-view-contents">
						<div className="change-view-counter d-flex">
							<div>1</div>
							<div>2</div>
							<div>3</div>
						</div>
						<div className="change-view d-flex">
							<div onClick={() => props.changeTheme()} className="ball"></div>
						</div>
					</div>
				</div>
				
			</header>

			<section className="display-screen container">
				{resultHistory.length?
					<div className="results-history-screen">
						{resultHistory.map((value, key)=>(
							<ul key={key} className="results-history">
								<li className="expression">{value.expression}</li>
								<li className="equality">=</li>
								<li className="results">
								<span>{value.results}</span>
								</li>
							</ul>
						))}
					</div>
					:
					null
				}
				
				<form onSubmit={(e) => props.handleSubmit(e)} 
					className="calculator-input-form">
					<div className="calculator-input-box">
						<input
							id="calculator-input"
							className="calculator-input"
							tabIndex={1}
							readOnly={true}
						   	autoFocus={true} 
							onClick={() => props.disablSoftKeyboard()}
							onChange={(e) =>props.handleFormChange(e)}
						   	value={props.expression}
						   	type="text"
						/>
					</div>
				</form>
				{props.error?
					<div className="error-message">
						<ul>
							<li>{props.error}</li>
						</ul>
					</div>
					:
					null
				}
			</section>

            <section className="calculator-buttons">
      			<div className="calculator-btn" data-value="7">7</div>
     			<div className="calculator-btn" data-value="8">8</div>
      			<div className="calculator-btn" data-value="9">9</div>
      			<div className="calculator-btn calculator-btn-delete" data-value="delete">
				    <button className="operator-btn btn-sm delete-btn" data-value="delete">
            			<Icon.Delete 
							className="calculator-btn-icon"
							data-value="delete" 
							size={iconSize}
						/>
        			</button>
      			</div>
      		
				<div className="calculator-btn" data-value="4">4</div>
     			<div className="calculator-btn" data-value="5">5</div>
      			<div className="calculator-btn" data-value="6">6</div>
      			<div className="calculator-btn" data-value="+">
				    <button className="operator-btn btn-sm" data-value="+">
            			<Icon.Plus className="calculator-btn-icon" data-value="+" size={iconSize}/>
        			</button>
				</div>
      			<div className="calculator-btn" data-value="1">1</div>
     		 	<div className="calculator-btn" data-value="2">2</div>
      			<div className="calculator-btn" data-value="3">3</div>
      			<div className="calculator-btn" data-value="-">
				    <button className="operator-btn btn-sm" data-value="-">
            			<Icon.Minus className="calculator-btn-icon" data-value="-" size={iconSize}/>
        			</button>
				</div>
      			<div className="calculator-btn" data-value=".">.</div>
      			<div className="calculator-btn" data-value="0">0</div>
      			<div className="calculator-btn" data-value="/">
				    <button className="operator-btn btn-sm" data-value="/">
            			<Icon.Divide className="calculator-btn-icon" data-value="/" size={iconSize}/>
        			</button>
				</div>
      			<div className="calculator-btn" data-value="x">
				    <button className="operator-btn btn-sm" data-value="*">
            			<Icon.X className="calculator-btn-icon" data-value="*" size={iconSize}/>
        			</button>
				</div>
      			<div className="calculator-btn calculator-btn-reset" data-value="reset">
        			RESET
     			</div>
      			<div className="calculator-btn calculator-btn-result" data-value="result">
        			=
      			</div>
    		</section >
        </div>
        
    );
};

export default CalcTemplate;

