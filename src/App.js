import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import 'chartjs-plugin-streaming';
import './App.css';
import greeterApi from './util/greeterApi';

class App extends Component {

    streamF = (chart) => {
        console.log("Start streaming");
        let name = '';
        // streaming call
        const stream = greeterApi.sayRepeatHello({ name, count: 1 });
        stream.on("data", (response) => {
            let chartArrText = ''
            chartArrText = response.getMessage();
            let chartArr = chartArrText.split(',').map(Number)
            console.log('Получаем данные...');
            console.log(chartArr);
            chart.config.data.datasets.forEach(function(dataset) {
                dataset.data.push({
                    x: Date.now(),
                    y: chartArr[0]
                });
            });

        });
        stream.on("error", (err) => {
            console.log(
                `Unexpected stream error: code = ${err.code}` +
                `, message = "${err.message}"`
            );
        });
        return () => {
            console.log("Stop streaming");
        };
    }

    onRefresh = (chart) => {
        chart.config.data.datasets.forEach(function(dataset) {
            dataset.data.push({
                x: Date.now(),
                y: (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100)
            });
        });
    }

    render() {
        return (
            <Line
                data={{
                    datasets: [{
                        label: 'Данные установки',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        fill: false,
                        cubicInterpolationMode: 'monotone',
                        data: []
                    }]
                }}
                options={{
                    title: {
                        display: true,
                        text: 'Пример графика с данными gRCP'
                    },
                    scales: {
                        xAxes: [{
                            type: 'realtime',
                            realtime: {
                                duration: 20000,
                                refresh: 1000,
                                delay: 2000,
                                onRefresh: this.streamF
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'value'
                            }
                        }]
                    },
                    tooltips: {
                        mode: 'nearest',
                        intersect: false
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: false
                    }
                }}
            />
        );
    }
}

export default App;
