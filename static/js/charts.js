
// Use of d3.json to load and retrieve the samples.json file 
const data = d3.json("static/data/samples.json");

function init() {
  data.then(d => {
    //populate options
    setSampleOptions(d);
    // get sample by default
    sampleSelected();
  });
}

init();

// listen to select an option to throw the function
d3.select('#selDataset').on(['change'], sampleSelected);





function setSampleOptions(data) {

  let selector = d3.select('#selDataset');
  data.names.forEach(sample => {
    selector.append("option").
      text(sample).property("value", sample);
  })
};

function getSelectedOption() {
  let selector = d3.select('#selDataset');
  let selectedValue = selector.property('value');

  return selectedValue
}


function sampleSelected() {
  let newSample = getSelectedOption();
  buildDemogTable(data, newSample);
  buildCharts(data, newSample);
}

function buildDemogTable(data, sample) {
  data.then(data => {
    var metadata = data.metadata;

    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var card = d3.select("#sample-metadata");
    card.html("");
    Object.entries(result).forEach(([key, value]) => {

      card.append("p").text(`${key.toUpperCase()}: ${value}`);

    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(data, selectedSample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  // 3. Create a variable that holds the samples array. 
  data.then(data => {
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleData = data.samples.filter(sample => sample.id == selectedSample);

    //  5. Create a variable that holds the first sample in the array.
    sampleData = sampleData[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    let otu_ids = sampleData.otu_ids;

    let sample_values = sampleData.sample_values;


    var zipSampleData = sampleData.otu_ids.map(function (elem, ind) {
      return [elem, sampleData.otu_labels[ind], sampleData.sample_values[ind]];
    });
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticks = otu_ids[0,10];
    zipSampleData = zipSampleData.sort((a, b) => b[2] - a[2]).slice(0, 10);


    let otu_ids_label = zipSampleData.map(elem => 'OTU ' + elem[0]);
    let otu_labels_10 = zipSampleData.map(elem => elem[1]);
    let sample_values_10 = zipSampleData.map(elem => elem[2]);




    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values_10.reverse(),
      y: otu_ids_label.reverse(),
      type: "bar",
      orientation: 'h',
      //hoverinfo: null,
      //hovertemplate: otu_labels.reverse(),
      text: otu_labels_10.reverse(),
    }];
    // 9. Create the layout for the bar chart. 
    var barlayout = {
      title: "Top 10 Bacteria Cultures Found",
      font: {
        family: 'Raleway, sans-serif'
      },

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barlayout,{responsive: true});
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Earth',
      },
      text: zipSampleData.map(elem => "(" + elem[0] + "," + elem[2] + ")<br>" + elem[1]),
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: {
          text: 'OTU ID',
        },
      },
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout,{responsive: true});

    selectedMetadata = data.metadata.filter(m => m.id == selectedSample);
    selectedMetadata = selectedMetadata[0]
    console.log('Selete Meta:',selectedMetadata);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: selectedMetadata.wfreq,
        title: { text: "Scrubs per Week", font:{size: 14}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {

          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
    
          bar: { color: "black" },
    
          bgcolor: "white",
    
          borderwidth: 2,
 
    
           steps: [
    
             { range: [0, 2], color: "red" },
    
             { range: [2, 4], color: "orange" },
             { range: [4, 6], color: "yellow" },
             { range: [6, 8], color: "lightgreen" },
             { range: [8, 10], color: "green" }
           ],
        }
      }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      title:"Belly Button Washing Frequency" ,
      font:{
        size : 12
      },
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout,{responsive: true});
  });
}



