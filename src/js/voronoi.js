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
            v.color = points[index].color;
            v.intensity = points[index].intensity;
            v.diff = points[index].diff.toFixed(2);
            v.temp = points[index].temp;
            if (!v) {
                console.error(`ONE OV POINTS IS ILLEGAL!!`);
            }
            // console.log(v);
        });
        svg.selectAll(".volonoi").remove();
        svg.selectAll("path")
            .data(polygons)
            .enter()
            .append("svg:path")
            .attr("class", "volonoi")
            .attr({
                d(d) {
                    if(!d) {
                        return null;
                    }
                    return "M" + d.cell.join("L") + "Z";
                },
                stroke:"black",
                fill(d) {
                    if (!d) {
                        return "red";
                    }
                    return d.color;
                },
                opacity(d) {
                    if (!d) {
                        return 0;
                    }
                    // console.log(Math.abs(d.intensity) + 0.01);
                    return Math.abs(d.intensity) + 0.01;
                }
            });

        svg.selectAll("text").remove();
        svg.append("g")
            .attr("class", "label")
          .selectAll("text")
            .data(polygons.map(d3.geom.polygon))
          .enter().append("text")
            .attr("class", function(d) {
                if (!d) {
                    return;
                }
                const centroid = d.centroid(),
                    point = d.point,
                    angle = Math.round(Math.atan2(centroid.y - point.y, centroid.x - point[0]) / Math.PI * 2);
                return "label--" + (d.orient = angle === 0 ? "right"
                  : angle === -1 ? "top"
                  : angle === 1 ? "bottom"
                  : "left");
            })
            .attr("transform", function(d) {
                if (!d) {
                    return;
                }
                return "translate(" + d.point.x + "," + d.point.y + ")";
            })
            .attr("dy", function(d) {
                if (!d) {
                    return;
                }
                return d.orient === "left" || d.orient === "right" ? ".35em" : d.orient === "bottom" ? ".71em" : null;
            })
            .attr("x", function(d) {
                if (!d) {
                    return;
                }
                return d.orient === "right" ? 6 : d.orient === "left" ? -6 : null;
            })
            .attr("y", function(d) {
                if (!d) {
                    return;
                }
                return d.orient === "bottom" ? 6 : d.orient === "top" ? -6 : null;
            })
            .text(function(d, i) {
                if (!d) {
                    return;
                }
                return `${d.temp} (${d.diff})`;
            });

    }
    map.on("viewreset moveend", update);

    update();
}
