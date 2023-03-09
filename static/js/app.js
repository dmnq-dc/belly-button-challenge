//Use D3 library to read samples from given url 

const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Demographic Info (Panel left side)
function panelInfo(id) {

  // Read dataset information from url to a json file
    d3.json(url).then(function (data) {

      // Create variables as needed from the dataset
        let sampleData = data;
        let metadata = sampleData.metadata;

      // Convert ID number to String by using filter
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0];

      // Create variable panel, and select #sample-metadata from html code id
        let panel = d3.select('#sample-metadata');
        panel.html('');

      // Append the new information using ForEach
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};

// Create Plots
function Plots(id) {
   // Read dataset information from url to a json file
    d3.json(url).then(function (data) {
      // Create variables as needed from the dataset
        let sampleData = data;
        let samples = sampleData.samples;

      // Filter id numbers
        let identifier = samples.filter(sample => sample.id === id);
        let filtered = identifier[0];
      
      //Sort the OTU values using slice and reverse 
        let OTU_values = filtered.sample_values.slice(0, 10).reverse();
        let OTU_ids = filtered.otu_ids.slice(0, 10).reverse();
        let labels = filtered.otu_labels.slice(0, 10).reverse();
      
      //Create Horizontal Bar Chart for Top 10 OTU 
        let trace1 = {
            x: OTU_values,
            y: OTU_ids.map(object => 'OTU ' + object),
            name: labels,
            type: 'bar',
            orientation: 'h'
        };

        // Create layout for h bar chart
        let layout1 = {
            title: `Top 10 OTUs for Subject ${id}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ID' }
        };

        // Data array for barchart
        let tracedata1 = [trace1];

        // Render the plot
        Plotly.newPlot('bar', tracedata1, layout1);


      // Create bubble chart
        let trace2 = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values,
                color: filtered.otu_ids,
                colorscale: 'Portland'
            },
            text: filtered.otu_labels,
        };

        // Data array for bubble chart
        let tracedata2 = [trace2];

         // Create layout for bubble chart
        let layout2 = {
            title: `OTUs for Subject ${id}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };

        // Render the plot
        Plotly.newPlot('bubble', tracedata2, layout2);
    })
};

//Show new information of bar and bubble chart whenever ID is changed.
function optionChanged(id) {
  // Call function Plots and PanelInfo above
    Plots(id);
    panelInfo(id);
};

//Test Subject Dropdown and initial function
function init() {
    let dropDown = d3.select('#selDataset');
    let id = dropDown.property('value');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        let samples = sampleData.samples;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        panelInfo(names[0]);
        Plots(names[0])
    })
};

init();
