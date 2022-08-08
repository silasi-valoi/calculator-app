import React from "react";
  
export interface State {
	error:string,
	currentTheme:number,
	resultHistory: {expression:string, results:string}[],
	expression:string,

}


export interface Props extends State {
    handleFormChange:(e:React.ChangeEvent<HTMLInputElement>)=> void,
    processResults:Function,
	handleSubmit: (e:React.FormEvent<HTMLFormElement>) => void,
	disablSoftKeyboard:Function,
	changeTheme:Function,
};


