import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface DataProps {
  x: string;
  y: number;
}

interface ChartProps {
  timeData: DataProps[];
}

const Chart: React.FC<ChartProps> = ({ timeData }) => {
  const series = [
    {
      name: 'Stock Price',
      data: timeData
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    },
    yaxis: {
      title: {
        text: 'Price'
      }
    },
    xaxis: {
      type: 'datetime'
    },
    tooltip: {
      shared: false,
      y: {
        formatter: (val: number) => `$${val.toFixed(2)}`
      }
    }
  };

  return (
    <div className="w-full h-full">
      <ReactApexChart options={options} series={series} type="area" height="100%" width="100%" />
    </div>
  );
};

export default Chart;
