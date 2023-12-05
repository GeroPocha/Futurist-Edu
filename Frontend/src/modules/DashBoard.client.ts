/* eslint-disable max-lines */
import { getBackendMainChartData, getBackendDonutChartData, setAmountOfStudentsEnrolled, getBackendDocumentUploadDates } from './DashBoard.js';

import ApexCharts from 'apexcharts';

const path = window.location.pathname;
const pathSegments = path.split('/'); 
const courseId = pathSegments[pathSegments.length - 1];


const getMainChartOptions = (dates, answerCounts, correctAnswerCounts) => {
	let mainChartColors = {};

	if (document.documentElement.classList.contains('dark')) {
		mainChartColors = {
			borderColor: '#374151',
			labelColor: '#9CA3AF',
			opacityFrom: 0,
			opacityTo: 0.15,
		};
	} else {
		mainChartColors = {
			borderColor: '#F3F4F6',
			labelColor: '#6B7280',
			opacityFrom: 0.45,
			opacityTo: 0,
		};
	}

	return {
		chart: {
			height: 420,
			type: 'area',
			fontFamily: 'Inter, sans-serif',
			foreColor: mainChartColors.labelColor,
			toolbar: {
				show: false,
			},
		},
		fill: {
			type: 'gradient',
			gradient: {
				enabled: true,
				opacityFrom: mainChartColors.opacityFrom,
				opacityTo: mainChartColors.opacityTo,
			},
		},
		dataLabels: {
			enabled: false,
		},
		tooltip: {
			style: {
				fontSize: '14px',
				fontFamily: 'Inter, sans-serif',
			},
		},
		grid: {
			show: true,
			borderColor: mainChartColors.borderColor,
			strokeDashArray: 1,
			padding: {
				left: 35,
				bottom: 15,
			},
		},
		series: [
			{
					name: 'Flashcards Answered',
					data: answerCounts,
					color: '#1A56DB',
			},
			{
					name: 'Flashcards Answered Correctly',
					data: correctAnswerCounts,
					color: '#4ade80',
			},
	],
		markers: {
			size: 5,
			strokeColors: '#ffffff',
			hover: {
				size: undefined,
				sizeOffset: 3,
			},
		},
		xaxis: {
			categories: dates,
			labels: {
				style: {
					colors: [mainChartColors.labelColor],
					fontSize: '14px',
					fontWeight: 500,
				},
			},
			axisBorder: {
				color: mainChartColors.borderColor,
			},
			axisTicks: {
				color: mainChartColors.borderColor,
			},
			crosshairs: {
				show: true,
				position: 'back',
				stroke: {
					color: mainChartColors.borderColor,
					width: 1,
					dashArray: 10,
				},
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: [mainChartColors.labelColor],
					fontSize: '14px',
					fontWeight: 500,
				},
				formatter(value) {
					return `${value}`;
				},
			},
		},
		legend: {
			fontSize: '14px',
			fontWeight: 500,
			fontFamily: 'Inter, sans-serif',
			labels: {
				colors: [mainChartColors.labelColor],
			},
			itemMargin: {
				horizontal: 10,
			},
		},
		responsive: [
			{
				breakpoint: 1024,
				options: {
					xaxis: {
						labels: {
							show: false,
						},
					},
				},
			},
		],
	};
};

const getDonutChartOptions = (values) => {
	let legendLabelColor;

	if (document.documentElement.classList.contains('dark')) {
			legendLabelColor = '#FFFFFF'; // for Dark-Mode
	} else {
			legendLabelColor = '#000000'; // for Light-Mode
	}


	return {
		series: values,
    labels: ['0 Flashcards', '1 - 20 Flashcards', '20 - 50 Flashcards', '50+ Flashcards'],
		chart: {
			type: 'donut',
			width: '100%',   
			height: 250      
		},
		colors: ['#F40D5E', '#F2C14E', '#49dd7f', '#1a56db'], 
		plotOptions: {
			pie: {
				startAngle: -90,
				endAngle: 90,
				offsetY: 10
			}
		},
		legend: {
			show: true,
			fontSize: '14px',
			fontWeight: 500,
			fontFamily: 'Inter, sans-serif',
			labels: {
				colors: legendLabelColor, 
			},
			itemMargin: {
				horizontal: 10,
			},
		},
		stroke: {
			width: 2, 
			colors: ['#4B5563'], 
		},
			grid: {
					padding: {
							bottom: -80,
					},
			},
			responsive: [
					{
							breakpoint: 480,
							options: {
									chart: {
											width: 200,
									},
									legend: {
											position: 'bottom',
									},
							},
					},
			],
	};
};


if (document.getElementById('donut-chart')) {
	const DonutChartValues = await getBackendDonutChartData(courseId);

	const donutChart = new ApexCharts(
			document.getElementById('donut-chart'),
			getDonutChartOptions(DonutChartValues),
	);
	donutChart.render();

	document.addEventListener('dark-mode', () => {
		donutChart.updateOptions(getDonutChartOptions(values));
	});
}

if (document.getElementById('main-chart')) {

	(async () => {
			try {
					const { dates, answerCounts, correctAnswerCounts } = await getBackendMainChartData(courseId, 8);

					const chartOptions = getMainChartOptions(dates, answerCounts, correctAnswerCounts);

					const chart = new ApexCharts(
							document.getElementById('main-chart'),
							chartOptions);
					chart.render();

					document.addEventListener('dark-mode', () => {
							chart.updateOptions(getMainChartOptions(dates, answerCounts, correctAnswerCounts));
					});
			} catch (error) {
					console.error('Error while fetching Data:', error);
			}
	})();
}

const displayDocumentUploadStatus = (uploadStatusData) => {
	const svgUploaded = `<svg class="w-6 h-6 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
	<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
</svg>`;

	const svgNotUploaded = `<svg class="w-6 h-6 text-red-500"aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
	<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
</svg>`;
	
const container = document.querySelector('#uploaded-documents-container');
    container.innerHTML = ''; 

    uploadStatusData.forEach((data) => {

        const dayElement = document.createElement('div');
        dayElement.className = 'flex flex-col items-center space-y-1'; 


        const dateSpan = document.createElement('span');
        dateSpan.className = 'date uppercase text-gray-900 dark:text-white'; 
        dateSpan.textContent = data.date;
        dayElement.appendChild(dateSpan);


        const svgPlaceholder = document.createElement('div');
        svgPlaceholder.className = 'svg-placeholder';
        svgPlaceholder.innerHTML = data.uploaded ? svgUploaded : svgNotUploaded;
        dayElement.appendChild(svgPlaceholder);

        container.appendChild(dayElement);
    });
};

const updateDocumentUploadStatus = async () => {
	try {
			const uploadStatusData = await getBackendDocumentUploadDates(courseId);
			displayDocumentUploadStatus(uploadStatusData);
	} catch (error) {
			console.error('Error:', error);
	}
};

setAmountOfStudentsEnrolled(courseId);

if (document.getElementById('uploaded-documents-container')) {
updateDocumentUploadStatus();
}
