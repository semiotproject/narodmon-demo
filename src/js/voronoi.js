/* eslint: disable */

import d3 from 'd3';

export function createPolygons(map, points) {

    map._initPathRoot();

    const svg = d3.select("#map").select("svg");
    const g = svg.append("g").attr("class", "leaflet-zoom-hide");
    const voronoi = d3.geom.voronoi()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    function update() {
        const positions = [];

        points.forEach((d) => {
            const latlng = new L.LatLng(d.x, d.y);
            positions.push({
                x :map.latLngToLayerPoint(latlng).x,
                y :map.latLngToLayerPoint(latlng).y
            });
        });

        const polygons = voronoi(positions);
        polygons.forEach(function(v, index) {
            v.cell = v;
            v.group = points[index].group;
            v.intensity = points[index].intensity;
        });

        console.log(`polygons: `, polygons);
        console.log(`svg: `, svg);

/*
        d3.selectAll('.AEDpoint').remove();
        //サークル要素を追加
        const circle = g.selectAll("circle")
            .data(positions)
            .enter()
            .append("circle")
            .attr("class", "AEDpoint")
            .attr({
                "cx":function(d, i) { return d.x; },
                "cy":function(d, i) { return d.y; },
                "r":20,
                fill:"red"
            });
*/
        svg.selectAll(".volonoi").remove();
        svg.selectAll("path")
            .data(polygons)
            .enter()
            .append("svg:path")
            .attr("class", "volonoi")
            .attr({
                d: function(d) {
                    if(!d) {
                        return null;
                    }
                    console.log(d);
                    return "M" + d.cell.join("L") + "Z";
                },
                stroke:"transparent",
                fill: (d) => {
                    return d.group === 1 ? "red" : "blue";
                },
                opacity: (d) => {
                    return Math.abs(d.intensity) + 0.1;
                }
            });

            svg.selectAll("text").remove();
            svg.append("g")
                .attr("class", "label")
              .selectAll("text")
                .data(polygons.map(d3.geom.polygon))
              .enter().append("text")
                .attr("class", function(d) {
                    console.log(d);
                    var centroid = d.centroid(),
                        point = d.point,
                        angle = Math.round(Math.atan2(centroid.y - point.y, centroid.x - point[0]) / Math.PI * 2);
                    return "label--" + (d.orient = angle === 0 ? "right"
                      : angle === -1 ? "top"
                      : angle === 1 ? "bottom"
                      : "left");
                })
                .attr("transform", function(d) { return "translate(" + d.point.x + "," + d.point.y + ")"; })
                .attr("dy", function(d) { return d.orient === "left" || d.orient === "right" ? ".35em" : d.orient === "bottom" ? ".71em" : null; })
                .attr("x", function(d) { return d.orient === "right" ? 6 : d.orient === "left" ? -6 : null; })
                .attr("y", function(d) { return d.orient === "bottom" ? 6 : d.orient === "top" ? -6 : null; })
                .text(function(d, i) { return "4.4"; });

        }

    map.on("viewreset moveend", update);

    update();
}