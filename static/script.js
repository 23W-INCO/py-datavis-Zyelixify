 // Fetch the patient data
 d3.json("/patients").then(function(data) {
    let ageGroups = [];
    data.forEach(function(patient) {
        if (!patient.deceasedDateTime) { // exclude diseased patients
            const patientBirthDate = new Date(patient.birthDate);
            const age = Math.floor((new Date() - patientBirthDate) / (1000 * 60 * 60 * 24 * 365.25));
            const ageGroup = Math.floor(age / 10) * 10;

            let group = ageGroups.find(group => group.ageGroup === ageGroup);

            if (!group) {
                group = {ageGroup, male: 0, female: 0};
                ageGroups.push(group);
            }

            if (patient.gender === "male") {
                group.male++;
            } else if (patient.gender === "female") {
                group.female++;
            }
        }
    });

    ageGroups.sort((a, b) => d3.ascending(a.ageGroup, b.ageGroup));

    const padding = 15;
    const margin = {top: 30, right: 0, bottom: 45, left: 60},
    width = 480 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxMaleAge = d3.max(ageGroups, d => d.male);
    const maxFemaleAge = d3.max(ageGroups, d => d.female);

    svg.append("text")
        .attr("x", 1/4 * width)
        .attr("y", -10)
        .text("Female");

    svg.append("text")
        .attr("x", 3/4 * width)
        .attr("y", -10)
        .attr("text-anchor", "end")
        .text("Male");

    // x axis
    const x = d3.scaleLinear()
        .domain([-maxFemaleAge, maxMaleAge])
        .range([padding, width - padding]);

    // x axis label
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(Math.abs));
    svg.append("text")
    .attr("x", width / 2) 
    .attr("y", height + 40) 
    .attr("text-anchor", "middle")  
    .text("Number of Patients"); 
    

    // y axis
    const y = d3.scaleBand()
        .range([0, height])
        .domain(ageGroups.map(d => d.ageGroup))
        .padding(.1);


    // y axis label
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("Age Group");

    // bars
    svg.selectAll(".male")
        .data(ageGroups)
        .enter()
        .append("rect")
        .attr("class", "male")
        .attr("x", d => x(0))
        .attr("y", d => y(d.ageGroup))
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
        .on("mouseover", function(event, d) { // Tooltip on hover
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Age Group: ${d.ageGroup}<br/>Males: ${d.male}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .transition()  // Animation
        .delay((d, i) => i * 50)
        .duration(500)
        .attr("width", d => x(d.male) - x(0));;

    svg.selectAll(".female")
        .data(ageGroups)
        .enter()
        .append("rect")
        .attr("class", "female")
        .attr("x", x(0))
        .attr("y", d => y(d.ageGroup))
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .attr("fill", "#4C4082")
        .on("mouseover", function(event, d) { // Tooltip on hover
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Age Group: ${d.ageGroup}<br/>Females: ${d.female}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .transition() // Animation
        .delay((d, i) => i * 50)
        .duration(500)
        .attr("width", d => x(d.female) - x(0))
        .attr("x", d => x(-d.female));
});