import { ResponsiveFunnel } from '@nivo/funnel'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const data = [
{
    "id": "step_sent",
    "value": 87488,
    "label": "Sent"
},
{
    "id": "step_viewed",
    "value": 63850,
    "label": "Viewed"
},
{
    "id": "step_clicked",
    "value": 44994,
    "label": "Clicked"
},
{
    "id": "step_add_to_card",
    "value": 30278,
    "label": "Add To Card"
},
{
    "id": "step_purchased",
    "value": 18709,
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