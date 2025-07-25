/* eslint-disable */

// 箱线图生成器
export default function boxplotOption(config, fileDataMap, xData, yDataArr, selectedChartType, seriesData, customOption = {}) {
    const { seriesList, seriesData_boxplot, outlierData } = seriesData;

    // legend.data 和 series[].name 都转为字符串，保证颜色和交互
    const legendData = seriesList.map(String);
    const debugSeries = legendData.map((ser, idx) => {
        return {
            name: ser,
            type: 'boxplot',
            data: seriesData_boxplot[idx],
            tooltip: {
                formatter: function (param) {
                    return [
                        `${ser} - ${xData[param.dataIndex]}`,
                        `Min: ${param.data[0]}`,
                        `Q1: ${param.data[1]}`,
                        `Median: ${param.data[2]}`,
                        `Q3: ${param.data[3]}`,
                        `Max: ${param.data[4]}`
                    ].join('<br/>');
                }
            }
        };
    });

    // 生成异常值 scatter series
    let outlierSeries = [];
    if (outlierData && Array.isArray(outlierData)) {
        outlierSeries = outlierData.map((outliers, idx) => ({
            name: legendData[idx] + ' Outlier',
            type: 'scatter',
            data: outliers,
            symbolSize: 8,
            tooltip: {
                formatter: function (param) {
                    return `${legendData[idx]} - ${xData[param.dataIndex]}<br/>Outlier: ${param.data[1]}`;
                }
            }
        }));
    }

    const option = {
        title: {
            text: 'Boxplot Chart',
            subtext: config.subtext || '',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
            },
            subtextStyle: {
                fontSize: 12,
            }
        },
        legend: {
            type: 'scroll',
            show: config.legendVisible !== false,
            top: config.legendPosition || 'bottom',
            data: legendData.concat(outlierSeries.map(s => s.name)),
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: {
            type: 'category',
            data: xData,
            axisLabel: {
                interval: 0,
                rotate: xData.length > 10 ? 45 : 0
            },
        },
        yAxis: {
            type: 'value',
            name: 'Value',
        },
        series: [...debugSeries, ...outlierSeries],
        ...customOption
    };
    return option;
}