import * as d3 from "d3";
import React, { useEffect, useCallback, useRef, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function useWindowDimension() {
  const [dimension, setDimension] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  useEffect(() => {
    const debouncedResizeHandler = debounce(() => {
      // console.log("***** debounced resize"); // See the cool difference in console
      setDimension([window.innerWidth, window.innerHeight]);
    }, 100); // 100ms
    window.addEventListener("resize", debouncedResizeHandler);
    return () => window.removeEventListener("resize", debouncedResizeHandler);
  }, []); // Note this empty array. this effect should run only on mount and unmount
  return dimension;
}

function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

function IncidentsOverview() {
  const [width, setWidth] = useState();
  const [data, setData] = React.useState();
  const [windowWidth, windowHeight] = useWindowDimension();
  const [elem, setElem] = useState();

  const fetchData = async () => {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/incidents_overview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTYwMDk3MzUxMywiZXhwIjoxNjAxNTc4MzEzfQ.OymFrLMMYgFAnYpveZPTgJVg6shCMhducqmZ21oYzY8&ward=2&dateRange='[243423,432423]'`
    );
    const { data } = await resp.json();
    setData(data);
  };

  React.useEffect(() => {
    if (!data) {
      fetchData();
    }
  });

  const ref = useCallback((node) => {
    if (node !== null) {
      setElem(node);
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  React.useEffect(() => {
    if (elem) {
      setWidth(elem.getBoundingClientRect().width);
    }
  }, [windowWidth, elem]);

  const sum = (values) => {
    return values.reduce((prev, value) => prev + value, 0);
  };

  const StackedBarChart = ({ data, containerWidth }) => {
    const axisBottomRef = useRef(null);
    const axisLeftRef = useRef(null);

    const header = "label,value1,value2,value3,value4";
    const body = data
      .map(({ label, values }) => [label, ...values].join(","))
      .join("\n");
    const csv = d3.csvParse([header, body].join("\n"));

    const margin = { top: 10, right: 0, bottom: 45, left: 40 };
    const width = containerWidth - 100 - margin.left - margin.right;
    const height = 265 - margin.top - margin.bottom;

    const subgroups = header.split(",");
    const labels = csv.map((data) => data.label || "");
    const max = Math.max(
      ...csv.map((data) =>
        sum([data.value1, data.value2, data.value3, data.value4].map(Number))
      )
    );

    const scaleX = d3.scaleBand().domain(labels).range([0, width]).padding(0.5);
    const scaleY = d3.scaleLinear().domain([0, max]).range([height, 0]);
    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#FEF6C5", "#ED817E", "#F4B7CC", "#F4BD83"]);
    const stacked = d3.stack().keys(subgroups)(csv);

    useEffect(() => {
      if (axisBottomRef.current) {
        d3.select(axisBottomRef.current).call(
          d3.axisBottom(scaleX).tickSize(0).tickPadding([20])
        );
      }

      if (axisLeftRef.current) {
        d3.select(axisLeftRef.current)
          .call(d3.axisLeft(scaleY).ticks(6).tickSize(0).tickPadding([20]))
          .call((g) => g.select(".domain").remove());
      }
    }, [scaleX, scaleY]);

    return (
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g ref={axisBottomRef} transform={`translate(0, ${height})`} />
          <g ref={axisLeftRef} />
          {stacked.map((data, index) => {
            return (
              <g key={`group-${index}`} fill={color(data.key)}>
                {data.map((d, index) => {
                  const label = String(d.data.label);
                  const y0 = scaleY(d[0]);
                  const y1 = scaleY(d[1]);

                  return (
                    <rect
                      key={`rect-${index}`}
                      x={scaleX(label)}
                      y={y1}
                      width={scaleX.bandwidth()}
                      height={y0 - y1 || 0}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <div className="incidents-overview" ref={ref}>
      <div class="title">
        <div className="incidents-overview-select">
          <Select
            id="incidents-overview-date-range"
            sx={{ height: "30px" }}
            value={"Past 7 days"}
            onChange={() => {}}
          >
            <MenuItem value={"Past 24 hours"}>Past 24 hours</MenuItem>
            <MenuItem value={"Past 7 days"}>Past 7 days</MenuItem>
            <MenuItem value={"Past month"}>Past month</MenuItem>
          </Select>
        </div>
      </div>
      {data && <StackedBarChart data={data} containerWidth={width} />}
    </div>
  );
}

export default IncidentsOverview;
