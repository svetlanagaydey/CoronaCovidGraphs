const regions = {
	world: {
		deaths: 0,
		confirmed: 0,
		recovered: 0,
		critical: 0,
	},
	africa: {
		deaths: 0,
		confirmed: 0,
		recovered: 0,
		critical: 0,
	},
	americas: {
		deaths: 0,
		confirmed: 0,
		recovered: 0,
		critical: 0,
	},
	europe: {
		deaths: 0,
		confirmed: 0,
		recovered: 0,
		critical: 0,
	},
	asia: {
		deaths: 0,
		confirmed: 0,
		recovered: 0,
		critical: 0,
	},
};

const currentCountry = {
	deaths: 0,
	confirmed: 0,
	recovered: 0,
	critical: 0,
};
const searchCountries = [];
const btnWorld = document.querySelector(".btnWorld");
const btnAsia = document.querySelector(".btnAsia");
const btnAfrica = document.querySelector(".btnAfrica");
const btnAmerica = document.querySelector(".btnAmerica");
const btnEurope = document.querySelector(".btnEurope");
const ctx = document.getElementById("myChart");

let myChart = "";

const generateChart = (resData) => {
	const data = [resData.deaths, resData.confirmed, resData.recovered, resData.critical];
	if (myChart !== "") myChart.destroy();
	myChart = new Chart(ctx, {
		type: "bar",
		data: {
			labels: ["Deaths", "Confirmed", "Recovered", "Critical"],
			datasets: [
				{
					label: ["cases"],
					data: data,
					backgroundColor: [
						"white",
						"#b6baf7",
						"#2f3379",
						" #4e54c8",
					],
					borderColor: "white",
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	});
};
const getRegionData = async (data, region) => {
	let data2 = [];
	const baseURLCovid = "https://corona-api.com/countries";
	if (region !== "world") {
		data.data.forEach((country, index) => {
			axios.get(`${baseURLCovid}/${country.cca2}`).then((response) => {
				regions[region].deaths += response.data.data.latest_data.deaths;
				regions[region].confirmed += response.data.data.latest_data.confirmed;
				regions[region].recovered += response.data.data.latest_data.recovered;
				regions[region].critical += response.data.data.latest_data.critical;
			});
		});
	} else {
		countries = await axios.get(baseURLCovid, [
			{
				headers: "application/json",
			},
		]);
		countries.data.data.forEach((country) => {
			regions.world.deaths += country.latest_data.deaths;
			regions.world.confirmed += country.latest_data.confirmed;
			regions.world.recovered += country.latest_data.recovered;
			regions.world.critical += country.latest_data.critical;
		});
		generateChart(regions.world);
	}
};
const getCountries = async (region) => {
	let data = [];
	let countries;
	const baseURL = "https://intense-mesa-62220.herokuapp.com/restcountries.herokuapp.com/api/v1/region/";
	if (region !== "world") {
		countries = await axios.get(baseURL + region);
		getRegionData(countries, region);
	} else {
		getRegionData([], region);
	}
};
btnWorld.addEventListener("click", () => {
	generateChart(regions.world);
});

btnAfrica.addEventListener("click", () => {
	generateChart(regions.africa);
});
btnAsia.addEventListener("click", () => {
	generateChart(regions.asia);
});
btnAmerica.addEventListener("click", () => {
	generateChart(regions.americas);
});
btnEurope.addEventListener("click", () => {
	generateChart(regions.europe);
});
window.addEventListener("load", () => {
	getCountries("world").catch((err) => {
		console.error(err);
	});

	getCountries("asia").catch((err) => {
		console.error(err);
	});
	getCountries("africa").catch((err) => {
		console.error(err);
	});
	getCountries("europe").catch((err) => {
		console.error(err);
	});
	getCountries("americas").catch((err) => {
		console.error(err);
	});
});

const searchBar = document.querySelector(".search-input");
const chartType = document.querySelector("#chart-type");
let timerId;
const resultContainer = document.querySelector(".results-container");
const changeData = (e) => {
	const country = searchCountries.find((country) => {
		return country.name === e.target.innerText;
	});
	searchBar.value = e.target.innerText;
	resultContainer.innerHTML = "";
	resultContainer.classList.remove("border-class");
	generateChart(country.latest_data, myChart.config._config.type);
	buttonsList.forEach((btn) => {
		btn.id = "";
	});
};
const populateArray = async () => {
	const baseURLCovid = "https://corona-api.com/countries";
	const countries = await axios.get(baseURLCovid);
	countries.data.data.forEach((country) => {
		searchCountries.push(country);
	});
};
populateArray();
// chartType.addEventListener("change", () => {
// 	const data = {
// 		deaths: myChart.data.datasets[0].data[0],
// 		confirmed: myChart.data.datasets[0].data[1],
// 		recovered: myChart.data.datasets[0].data[2],
// 		critical: myChart.data.datasets[0].data[3],
// 	};
// 	generateChart(data, chartType.value);
// });

const search = (e) => {
	resultContainer.innerHTML = "";
	resultContainer.classList.remove("border-class");

	const filteredCountries = searchCountries.filter((inStr) => {
		return inStr.name.toLowerCase().includes(searchBar.value.toLowerCase());
	});
	clearTimeout(timerId);
	if (e.target.value !== "")
		timerId = setTimeout(() => {
			displayResults(filteredCountries);
		}, 1000);
};
const displayResults = (countriesList) => {
	countriesList.forEach((country) => {
		const button = document.createElement("button");
		button.type = "button";
		button.innerText = country.name;
		resultContainer.append(button);
		button.addEventListener("click", changeData);
	});
	resultContainer.classList.add("border-class");
	if (countriesList.length === 0) {
		resultContainer.innerText = "Sorry couldn't find any countries with this name,please try again";
	}
};
searchBar.addEventListener("input", search);
searchBar.addEventListener("focusout", () => {
	setTimeout(() => {
		resultContainer.innerHTML = "";
		resultContainer.classList.remove("border-class");
	}, 500);
});
searchBar.addEventListener("focus", search);

