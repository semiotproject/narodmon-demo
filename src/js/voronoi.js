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
    }

    map.on("viewreset moveend", update);

    update();
}