import { ResponsiveFunnel } from '@nivo/funnel'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const data = [
{
    "id": "50대 이상",
    "value": 5 ,
    "label": "Sent"
},
{
    "id": "40대",
    "value": 1,
    "label": "Viewed"
},
{
    "id": "30대",
    "value": 1,
    "label": "Clicked"
},
{
    "id": "20대",
    "value": 5,
    "label": "Add To Card"
},
{
    "id": "10대",
    "value": 0,
    "label": "Purchased"
}
];
const MyResponsiveFunnel = () => (
    <ResponsiveFunnel
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        valueFormat=">-.4s"
        colors={{ scheme: 'spectral' }}
        borderWidth={20}
        labelColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    3
                ]
            ]
        }}
        beforeSeparatorLength={100}
        beforeSeparatorOffset={20}
        afterSeparatorLength={100}
        afterSeparatorOffset={20}
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        motionConfig="wobbly"
    />
)
export default MyResponsiveFunnel;