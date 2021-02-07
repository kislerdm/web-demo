const cntHours = 24,
    dailySkuBaseline = 40000;

let
    hours = [...Array(cntHours).keys()],
    productTotalCnt = hours.map(() => dailySkuBaseline + Math.floor(Math.random() * 40)),
    productOptimizerCnt = hours.map((_, i) => {
        if (i > 0) {
            return (Math.floor(dailySkuBaseline * Math.random() * 0.2) + Math.floor(Math.random() * 40));
        };
        return Math.floor(dailySkuBaseline * .78);
    }),
    productOptimizerPct = productOptimizerCnt.map(it => (it / dailySkuBaseline * 100).toFixed(2)),
    hoverText = hours.map((el, idx) => {
        el = el < 10 ? `0${el}` : el;
        let out = `<i>Hour</i>: ${el}<br>
<em># of submitted items</em>: ${productTotalCnt[idx]}<br>
<em># of optimizer prices</em>: ${productOptimizerCnt[idx]} (${productOptimizerPct[idx]}%)`;
        return out;
    });

let
    productsTotal = {
        type: 'bar',
        x: hours,
        y: productTotalCnt,
        yaxis: 'y1',
        marker: {
            color: 'rgb(158,202,225)',
            opacity: 0.4,
            line: {
                width: .5
            }
        },
        hoverinfo: 'skip',
    },
    productsOptimizedPrices = {
        type: 'scatter',
        mode: 'lines+markers',
        x: hours,
        y: productOptimizerPct,
        yaxis: 'y2',
        marker: {
            color: 'rgb(49,130,189)',
            opacity: 1,
            size: 3,
            symbol: "circle",
            line: {
                width: 3.
            }
        },
        text: hoverText,
        hovermode: 'text',
        hovertemplate: '%{text}<extra></extra>',
    },

    data = [productsTotal, productsOptimizedPrices],
    layout = {
        title: 'Change prices dynamics today',
        showlegend: false,
        font: { size: 18 },
        xaxis: {
            gridwidth: 2,
            title: 'hour',
            ticklabelmode: 'array',
            tickvals: hours,

        },
        yaxis1: {
            zeroline: true,
            title: 'Count of items',
            side: 'left',
            rangemode: 'tozero',
        },
        yaxis2: {
            title: 'Ratio of optimized prices [%]',
            titlefont: { color: 'rgb(49,130,189)' },
            tickfont: { color: 'rgb(49,130,189)' },
            overlaying: 'y1',
            side: 'right',
            rangemode: 'tozero',
            gridwidth: 2,
            range: [0., 100.],
        },
        hoverlabel: { bgcolor: "#FFF" },
    },
    config = { responsive: true }
    ;

Plotly.newPlot('PlotDynamics', data, layout, config);

const genPrices = () => {
    const q2 = parseFloat((Math.random() * 5. - Math.random() * 2).toFixed(2)),
        min = parseFloat((q2 - Math.random() * 5.).toFixed(2)),
        max = parseFloat((q2 + Math.random() * 5.).toFixed(2)),
        q1 = parseFloat((q2 - Math.random() * 2.).toFixed(2)),
        q3 = parseFloat((q2 + Math.random() * 2.).toFixed(2));
    return { min: min, q1: q1, q2: q2, q3: q3, max: max };
};

let priceDynamics = hours.map((_) => genPrices()).flat();

data = hours.map((el) => {
    const prices = genPrices();
    return ({
        type: 'box',
        name: el,
        x: el,
        y: [prices.min, prices.q1, prices.q2, prices.q2, prices.q3, prices.max],
        marker: {
            color: 'rgb(49,130,189)',
            opacity: 1,
            size: 3,
        },
    });
});

layout['yaxis'] = {
    title: 'Relative price change [%]',
    side: 'left',
    rangemode: 'tozero',
    gridwidth: 2,
};

['xaxis1', 'yaxis1', 'yaxis2', 'title'].forEach((el) => delete layout[el]);

Plotly.newPlot('PlotValue', data, layout, config);

const PirceSku = {
    xxxx: hours.map((el) => {
        if (el < 14) { return 10. }
        return 10.5
    }),
    yyyy: hours.map((el) => {
        if (el < 5) {return 5.6}
        if (el > 4 && el < 19) { return 6.1 }
        return 6.3
    }),
    zzzz: hours.map((el) => {
        if (el < 9) { return 61.5 }
        if (el > 8 && el < 18) { return 60. }
        return 62.
    }),
};

let layoutSku = layout;

const plotSkuDynamics = (sku) => {
    layoutSku['title'] = `Prices dynamics for SKU "${sku}" today`;
    const prices = PirceSku[sku];
    dataSku = [{
        type: 'bar',
        x: hours,
        y: prices,
        marker: {
            color: 'rgb(49,130,189)',
            opacity: 0.8,
            size: 3,
        },
    }];

    layout['yaxis'] = {
        title: 'Item price',
        side: 'left',
        rangemode: 'tozero',
        gridwidth: 2,
        range: [Math.min(...prices) * 0.95, Math.max(...prices) * 1.05],
    };

    Plotly.newPlot('PlotValueItem', dataSku, layoutSku, config);
}

plotSkuDynamics(Object.keys(PirceSku)[0]);

const getSku = () => plotSkuDynamics(document.getElementById('sku').value);
