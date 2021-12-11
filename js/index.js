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
					label: ["4 of Cases"],
					data: data,
					backgroundColor: [
						"white",
						"#b6baf7",
						"#2f3379",
						" #4e54c8",
						"rgba(153, 102, 255, 1)",
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
