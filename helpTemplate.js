// import {DOMAnimations, Events} from  './plugins/engaz.js';




// realTime data requets
 
export class realTimeData {
	static status = null;
	static async fetchXmlData(apiUrl, toThisdiv, length, whereCut) {
		let alldata;
		
		await fetch(`${apiUrl}`)
			.then((result) => {
				return result.text()
			})
			.then((data) => {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(data, "text/html");
				
				const getShowMore = xmlDoc.getElementById("ws");
				
				if(whereCut !== ""){
					const productHolder = Array.from(
						xmlDoc.querySelectorAll(`${whereCut}`)
					);
					if(length == "all") {
						productHolder.forEach((element) => {
							toThisdiv.appendChild(element);
						});
						alldata = productHolder;
					}else{
						let divproducts = document.querySelector(".products");
						
						//divproducts.style.opacity = 0;
						divproducts.innerHTML = "";
						productHolder.slice(0, length).forEach((element) => toThisdiv.appendChild(element));
						//divproducts.style.opacity = 1;
					}
				}
					
				else{
					alldata = xmlDoc;
				
				}
					
			})
			return alldata;
		
	};

static async postFormDataRealTime(formDataToCart, postTo) {
		let	dataReturn;
		await fetch(`${postTo}`, {
		body: formDataToCart,
		headers: {
			"Content-Disposition": "inline"	
		},
		method: "POST",
		redirect: 'follow',
		mode: 'cors'
		}).then(data => {
			dataReturn =  data.text();
		})
		
		return dataReturn
		
	};
	/// return all data page
	static async fetch2XmlData(apiUrl, toThisdiv) {
		let dataAll;
		await fetch(`${apiUrl}`)
			.then((result) => {
				return result.text()
			})
			.then((data) => {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(data, "text/html");
				const getShowMore = xmlDoc.getElementById("ws");
				dataAll = xmlDoc;
				
			})
			return dataAll;
		
	};
	
	static async cutDataXml(allData, getThisDiv) {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(allData, "text/html");
		const getShowMore = xmlDoc.querySelectorAll(`${getThisDiv}`);
		return getShowMore
	};

	// post data form by featch
	static async postFormRealTime(form, postTo) {
		let formDataToCart = new FormData(form),
			dataReturn;
		await fetch(`${postTo}`, {
		body: formDataToCart,
		headers: {
			"Content-Disposition": "inline"	
		},
		method: "POST",
		redirect: 'follow',
		mode: 'cors'
		}).then(data => {
			dataReturn =  data.text();
		})
		
		return dataReturn
		
	};
	static async postFormDataRealTime(formDataToCart, postTo) {
		let	dataReturn;
		await fetch(`${postTo}`, {
		body: formDataToCart,
		headers: {
			"Content-Disposition": "inline"	
		},
		method: "POST",
		redirect: 'follow',
		mode: 'cors'
		}).then(data => {
			dataReturn =  data.text();
		})
		
		return dataReturn
		
	};

	// start method retrun redirect and return data
	static async postFormDataRealTimeAndReturnUrl(formDataToCart, postTo) {
		let	dataReturn,
			url
		await fetch(`${postTo}`, {
		body: formDataToCart,
		headers: {
			"Content-Disposition": "inline"	
		},
		method: "POST",
		redirect: 'follow',
		mode: 'cors'
		}).then(data => {
			url = data.url;
			 // window.location.replace(data.url)
			dataReturn =  data.text();
		})
		
		return {
			redirct: url,
			data: dataReturn
		}
		
	};
	
	// start any Form Action address and login ...
	static async formActonFunction(form, loadingSection, positionAlert, api, callBack)  {
		let statusForm = false;
		
		let body = positionAlert ? positionAlert : document.getElementsByTagName("BODY")[0];
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			loadingSection.style.display = "flex";
			    this.postFormRealTime(form, `${api}`).then(data => {
				loadingSection.style.display = "none";
				 this.cutDataXml(data, ".flash").then(alerts => {
					if(alerts[0]?.className === "flash success"){
						statusForm = true;
						alert.removeAll()
						form.submit()
					}else{
						// alert.addThisAlert(alerts[0]);
						alerts.forEach(alert => {
							body.innerHTML += alert.innerHTML;
						})
						if(callBack)
							callBack(alerts)
					}
				})
			})
			
		})
		return await statusForm
	}
	static async formActonFunctionByNotLissnerWithButton(form, loadingSection, positionAlert, api, callBack)  {
		let statusForm = false;
		
		let body = positionAlert ? positionAlert : document.getElementsByTagName("BODY")[0];
			loadingSection.style.display = "flex";
			    this.postFormRealTime(form, `${api}`).then(data => {
				loadingSection.style.display = "none";
				 this.cutDataXml(data, ".flash").then(alerts => {
					if(alerts[0]?.className === "flash success"){
						statusForm = true;
						alert.removeAll()
						form.submit()
					}else{
						alerts.forEach(alert => {
							body.innerHTML += alert.innerHTML;
						})
						if(callBack){
							callBack(alerts)
						}
					}
				})
			})
			
	
		return await statusForm
	}
	
	
}



/// start class help cart page
export class cartPage {
	// this method get total price
	static async getTotalPrice(cartUrlApi = '/cart') {

		let totalDiv = document.querySelectorAll(".total"),
			totalPrices;
		await fetch(cartUrlApi).then(data => {
			return data.text()
		}).then(data => {
			realTimeData.cutDataXml(data, ".total").then(totalPrice => {
				totalPrices = totalPrice;
			})
		})
		return totalPrices
	}

	// method get length product inb cart
	static async getLengthProduct(cartUrlApi = '/cart') {

		let totalDiv = document.querySelectorAll(".length_cart"),
			lengthProducts;
		await fetch(cartUrlApi).then(data => {
			return data.text()
		}).then(data => {
			realTimeData.cutDataXml(data, ".length_cart").then(length => {
				lengthProducts = length;
				totalDiv.forEach(div => {
					div.innerText = lengthProducts[0].innerText
				})
			})
		})
		return lengthProducts
	}
	
	
}

export class alert {

	static async addThisAlert(alert) {
		let alertsInPage = document.querySelectorAll(".alert"),
			bodyElement = document.getElementsByTagName("body")[0];
		alertsInPage.forEach(alert => {
			alert.remove()
		})
		bodyElement.appendChild(alert);
	}


	static removeAll(className = ".alert") {

		let alertsInPage = document.querySelectorAll(`${className}`),
			bodyElement = document.getElementsByTagName("body")[0];
		
		alertsInPage.forEach(alert => {
			alert.remove()
		})
		
	}

	static showError (pra)  {
		let body =   document.getElementsByTagName('body')[0],
			prax = `
		<div class="alert errors" style="display: flex">
		<div class="container_alert">
		<div class="img_alert">
		<img src="https://cdn.lexmodo.com/13/fbf6ec4560cc584fdd33d4c5b1e4d80b13/images/error-3694127660.svg">
		<img src="https://cdn.lexmodo.com/13/fbf6ec4560cc584fdd33d4c5b1e4d80b13/images/success-2200313718.svg">
		</div>
		<div class="title_alert">
		<h4 class="title_error">Something went wrong</h4>
		<h4 class="title_suc">success </h4>
		<p> ${pra} </p>
		</div>
		<div class="exit_alert">
		<button> </button>
		</div>
		</div>
		</div>
		`;
			let alerts = document.querySelectorAll(".alert");
			alerts.forEach(el => el.remove())
			body.insertAdjacentHTML("afterbegin", prax)
	}


	static showSucsess (mes)  {
		let body =   document.getElementsByTagName('body')[0],
			alerHTML = `
		<div class="alert success" style="display: flex ">
		<div class="container_alert">
		<div class="img_alert">
		<img src="https://cdn-1.lexmodo.com/af36bc507cd026cb3f6bdb02cc994a69/file/error-3427752436.svg">
		<img src="https://cdn-1.lexmodo.com/af36bc507cd026cb3f6bdb02cc994a69/file/success-3242252070.svg">
		</div>
		<div class="title_alert">
		<h4 class="title_error">Something went wrong</h4>
		<h4 class="title_suc">success </h4>
		<p> - ${mes} </p>
		</div>
		</div>
		</div>
		`;
		let alerts = document.querySelectorAll(".alert");
		alerts.forEach(el => el.remove())
		body.insertAdjacentHTML("afterbegin", alerHTML)
	}
}














