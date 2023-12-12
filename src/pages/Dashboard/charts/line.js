import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const data = [{
    "id": "japan",
    "color": "hsl(166, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 47
      },
      {
        "x": "helicopter",
        "y": 27
      },
      {
        "x": "boat",
        "y": 228
      },
      {
        "x": "train",
        "y": 49
      },
      {
        "x": "subway",
        "y": 100
      },
      {
        "x": "bus",
        "y": 68
      },
      {
        "x": "car",
        "y": 76
      },
      {
        "x": "moto",
        "y": 135
      },
      {
        "x": "bicycle",
        "y": 224
      },
      {
        "x": "horse",
        "y": 112
      },
      {
        "x": "skateboard",
        "y": 210
      },
      {
        "x": "others",
        "y": 54
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(49, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 102
      },
      {
        "x": "helicopter",
        "y": 59
      },
      {
        "x": "boat",
        "y": 226
      },
      {
        "x": "train",
        "y": 93
      },
      {
        "x": "subway",
        "y": 127
      },
      {
        "x": "bus",
        "y": 3
      },
      {
        "x": "car",
        "y": 73
      },
      {
        "x": "moto",
        "y": 241
      },
      {
        "x": "bicycle",
        "y": 124
      },
      {
        "x": "horse",
        "y": 248
      },
      {
        "x": "skateboard",
        "y": 14
      },
      {
        "x": "others",
        "y": 3
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(49, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 37
      },
      {
        "x": "helicopter",
        "y": 231
      },
      {
        "x": "boat",
        "y": 130
      },
      {
        "x": "train",
        "y": 175
      },
      {
        "x": "subway",
        "y": 207
      },
      {
        "x": "bus",
        "y": 123
      },
      {
        "x": "car",
        "y": 114
      },
      {
        "x": "moto",
        "y": 123
      },
      {
        "x": "bicycle",
        "y": 96
      },
      {
        "x": "horse",
        "y": 32
      },
      {
        "x": "skateboard",
        "y": 105
      },
      {
        "x": "others",
        "y": 68
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(328, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 147
      },
      {
        "x": "helicopter",
        "y": 210
      },
      {
        "x": "boat",
        "y": 250
      },
      {
        "x": "train",
        "y": 247
      },
      {
        "x": "subway",
        "y": 63
      },
      {
        "x": "bus",
        "y": 29
      },
      {
        "x": "car",
        "y": 144
      },
      {
        "x": "moto",
        "y": 74
      },
      {
        "x": "bicycle",
        "y": 4
      },
      {
        "x": "horse",
        "y": 147
      },
      {
        "x": "skateboard",
        "y": 35
      },
      {
        "x": "others",
        "y": 183
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(328, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 188
      },
      {
        "x": "helicopter",
        "y": 172
      },
      {
        "x": "boat",
        "y": 21
      },
      {
        "x": "train",
        "y": 144
      },
      {
        "x": "subway",
        "y": 3
      },
      {
        "x": "bus",
        "y": 136
      },
      {
        "x": "car",
        "y": 269
      },
      {
        "x": "moto",
        "y": 266
      },
      {
        "x": "bicycle",
        "y": 208
      },
      {
        "x": "horse",
        "y": 120
      },
      {
        "x": "skateboard",
        "y": 20
      },
      {
        "x": "others",
        "y": 175
      }
    ]
  }];
  
const MyResponsiveLine = () => (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)

export default MyResponsiveLine;