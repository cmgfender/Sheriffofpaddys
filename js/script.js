// Dynamic Widget Loading
const widgets = [
    {
        name: "Bluesky",
        src: "https://bsky.app/embed",
        title: "Bluesky"
    },
    {
        name: "Goodreads",
        src: "https://www.goodreads.com/widgets",
        title: "Goodreads"
    },
    {
        name: "Last.fm",
        src: "https://www.last.fm/embed",
        title: "Last.fm"
    }
];

const widgetContainer = document.getElementById('widgets');

// Rotate Widgets
let currentWidgetIndex = 0;
function loadWidget() {
    widgetContainer.innerHTML = `
        <iframe src="${widgets[currentWidgetIndex].src}" title="${widgets[currentWidgetIndex].title}" style="width:100%; height:300px; border:none;"></iframe>
    `;
    currentWidgetIndex = (currentWidgetIndex + 1) % widgets.length;
}

// Initial Load
loadWidget();
setInterval(loadWidget, 10000); // Rotate every 10 seconds
