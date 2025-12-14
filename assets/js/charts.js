// Interactive Charts using Chart.js

// Wait for Chart.js to be available
if (typeof Chart !== 'undefined') {
// Chart.js Default Config (Yektanet Theme)
    Chart.defaults.font.family = 'Sahel, IRANSans, sans-serif';
Chart.defaults.color = '#323232';
} else {
    // Chart.js will be loaded later, config will be set in initCharts
    console.warn('⚠️ Chart.js not loaded yet, will configure later');
}

const YEKTANET_COLORS = {
    gold: '#fed813',
    saffron: '#f3c42e',
    jet: '#323232',
    smoke: '#f2f2f2',
    keppel: '#2fbea8',
    aqua: '#3de19c',
    honey: '#ffb113',
    pink: '#fd6f95',
    blue: '#17b1fd',
    blueberry: '#797efe',
    slate: '#8763f8',
    lavender: '#b68cf8'
};

// Chart Templates
const ChartTemplates = {
    // 1. Follower Growth Chart
    followerGrowth: {
        type: 'line',
        data: {
            labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
            datasets: [{
                label: 'فالوور اینستاگرام',
                data: [143000, 152000, 161000, 170000],
                borderColor: YEKTANET_COLORS.saffron,
                backgroundColor: 'rgba(243, 196, 46, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: YEKTANET_COLORS.gold,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 13, weight: 'bold' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(50, 50, 50, 0.9)',
                    titleColor: YEKTANET_COLORS.gold,
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString('fa-IR') + ' نفر';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return (value / 1000).toLocaleString('fa-IR') + 'K';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    },

    // 2. Budget Distribution (Pie Chart)
    budgetDistribution: {
        type: 'doughnut',
        data: {
            labels: [
                'محتوای اینستاگرام',
                'طراحی وب‌سایت',
                'عکاسی و ویدیو',
                'تبلیغات اینستاگرام',
                'تبلیغات رسانه‌ای',
                'بازاریابی رویدادمحور',
                'سایر'
            ],
            datasets: [{
                data: [250, 450, 380, 185, 190, 155, 190],
                backgroundColor: [
                    YEKTANET_COLORS.saffron,
                    YEKTANET_COLORS.keppel,
                    YEKTANET_COLORS.aqua,
                    YEKTANET_COLORS.honey,
                    YEKTANET_COLORS.pink,
                    YEKTANET_COLORS.blue,
                    YEKTANET_COLORS.lavender
                ],
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    rtl: true,
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: { size: 12 },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percent = ((value / total) * 100).toFixed(1);
                                return {
                                    text: `${label} (${percent}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(50, 50, 50, 0.95)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            return value.toLocaleString('fa-IR') + ' میلیون تومان';
                        }
                    }
                }
            }
        }
    },

    // 3. KPI Progress (Bar Chart)
    kpiProgress: {
        type: 'bar',
        data: {
            labels: ['فالوور', 'Engagement', 'ترافیک سایت', 'امتیاز گوگل', 'اعضای باشگاه'],
            datasets: [
                {
                    label: 'وضعیت فعلی',
                    data: [143000, 0, 0, 3.8, 0],
                    backgroundColor: 'rgba(200, 200, 200, 0.5)',
                    borderColor: '#999',
                    borderWidth: 2
                },
                {
                    label: 'هدف ۴ ماهه',
                    data: [170000, 6, 25000, 4.5, 2000],
                    backgroundColor: YEKTANET_COLORS.saffron,
                    borderColor: YEKTANET_COLORS.gold,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(50, 50, 50, 0.9)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let value = context.parsed.y;
                            const label = context.dataset.label;
                            
                            // Format based on metric
                            if (context.dataIndex === 0) {
                                return `${label}: ${value.toLocaleString('fa-IR')} نفر`;
                            } else if (context.dataIndex === 1) {
                                return `${label}: ${value}%`;
                            } else if (context.dataIndex === 2) {
                                return `${label}: ${value.toLocaleString('fa-IR')} بازدید`;
                            } else if (context.dataIndex === 3) {
                                return `${label}: ${value.toFixed(1)} ⭐`;
                            } else {
                                return `${label}: ${value.toLocaleString('fa-IR')} نفر`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            if (value >= 1000) {
                                return (value / 1000).toLocaleString('fa-IR') + 'K';
                            }
                            return value.toLocaleString('fa-IR');
                        }
                    }
                }
            }
        }
    },

    // 4. Timeline Gantt (Horizontal Bar)
    timelineGantt: {
        type: 'bar',
        data: {
            labels: [
                'طراحی وب‌سایت',
                'عکاسی (۴ جلسه)',
                'تولید محتوا',
                'کمپین تبلیغاتی ۱',
                'کمپین تبلیغاتی ۲',
                'کمپین تبلیغاتی ۳',
                'کمپین تبلیغاتی ۴',
                'رویدادها (۸ عدد)',
                'باشگاه مشتریان'
            ],
            datasets: [{
                label: 'مدت زمان (روز)',
                data: [60, 120, 120, 30, 30, 30, 30, 120, 90],
                backgroundColor: [
                    YEKTANET_COLORS.keppel,
                    YEKTANET_COLORS.aqua,
                    YEKTANET_COLORS.saffron,
                    YEKTANET_COLORS.honey,
                    YEKTANET_COLORS.honey,
                    YEKTANET_COLORS.honey,
                    YEKTANET_COLORS.honey,
                    YEKTANET_COLORS.pink,
                    YEKTANET_COLORS.blue
                ],
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(50, 50, 50, 0.9)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x + ' روز';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 120,
                    ticks: {
                        callback: function(value) {
                            return value + ' روز';
                        }
                    }
                },
                y: {
                    ticks: {
                        font: { size: 11 }
                    }
                }
            }
        }
    },

    // 5. Google Map Rating Progress
    ratingProgress: {
        type: 'line',
        data: {
            labels: ['فعلی', 'هفته ۴', 'هفته ۸', 'هفته ۱۲', 'هفته ۱۶ (هدف)'],
            datasets: [
                {
                    label: 'امتیاز گوگل مپ',
                    data: [3.8, 4.0, 4.2, 4.3, 4.5],
                    borderColor: YEKTANET_COLORS.keppel,
                    backgroundColor: 'rgba(47, 190, 168, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: YEKTANET_COLORS.keppel
                },
                {
                    label: 'تعداد نظرات',
                    data: [208, 250, 300, 350, 400],
                    borderColor: YEKTANET_COLORS.aqua,
                    backgroundColor: 'rgba(61, 225, 156, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1',
                    pointRadius: 5,
                    pointBackgroundColor: YEKTANET_COLORS.aqua
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 3,
                    max: 5,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1) + ' ⭐';
                        }
                    },
                    title: {
                        display: true,
                        text: 'امتیاز'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('fa-IR');
                        }
                    },
                    title: {
                        display: true,
                        text: 'تعداد نظرات'
                    }
                }
            }
        }
    }
};

// Initialize Charts
let initChartsRetryCount = 0;
const MAX_INIT_CHARTS_RETRIES = 15;

function initCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded! Waiting...');
        // Retry after Chart.js loads
        if (initChartsRetryCount < MAX_INIT_CHARTS_RETRIES) {
            initChartsRetryCount++;
            setTimeout(() => {
                if (typeof Chart !== 'undefined') {
                    console.log('✅ Chart.js loaded, retrying...');
                    initCharts();
                } else {
                    initCharts();
                }
            }, 500);
        } else {
            console.error('❌ Max retries reached for Chart.js loading');
        }
        return;
    }
    
    // Set Chart.js defaults if not already set
    if (!Chart.defaults.font || Chart.defaults.font.family !== 'Sahel, IRANSans, sans-serif') {
        Chart.defaults.font = Chart.defaults.font || {};
        Chart.defaults.font.family = 'Sahel, IRANSans, sans-serif';
        Chart.defaults.color = '#323232';
    }
    
    console.log('📊 Initializing charts...');
    
    // Follower Growth Chart (in goals or other sections)
    const followerCtx = document.getElementById('chart-follower-growth');
    if (followerCtx) {
        try {
            const existingChart = Chart.getChart(followerCtx);
            if (existingChart) {
                existingChart.destroy();
            }
        new Chart(followerCtx, ChartTemplates.followerGrowth);
            console.log('✅ Follower Growth Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Follower Growth Chart:', e);
        }
    }

    // Budget Distribution Chart
    const budgetCtx = document.getElementById('chart-budget-distribution');
    if (budgetCtx) {
        try {
            // Check if chart already exists
            const existingChart = Chart.getChart(budgetCtx);
            if (existingChart) {
                existingChart.destroy();
            }
        new Chart(budgetCtx, ChartTemplates.budgetDistribution);
            console.log('✅ Budget Distribution Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Budget Distribution Chart:', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-budget-distribution');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        new Chart(retryCtx, ChartTemplates.budgetDistribution);
                        console.log('✅ Budget Distribution Chart initialized (retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing Budget Distribution Chart (retry):', e2);
                }
            }, 1000);
        }
    } else {
        console.warn('⚠️ chart-budget-distribution element not found');
    }

    // Individual KPI Growth Charts
    
    // 1. Instagram Followers Growth
    const followersCtx = document.getElementById('chart-followers-growth');
    if (followersCtx) {
        try {
            const existingChart = Chart.getChart(followersCtx);
            if (existingChart) existingChart.destroy();
            
            new Chart(followersCtx, {
                type: 'line',
                data: {
                    labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                    datasets: [{
                        label: 'فالوور اینستاگرام',
                        data: [143000, 150000, 160000, 170000],
                        borderColor: YEKTANET_COLORS.saffron,
                        backgroundColor: 'rgba(243, 196, 46, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: YEKTANET_COLORS.gold,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(50, 50, 50, 0.9)',
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y.toLocaleString('fa-IR') + ' نفر';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 140000,
                            max: 175000,
                            ticks: {
                                callback: function(value) {
                                    return (value / 1000).toLocaleString('fa-IR') + 'K';
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Followers Growth Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Followers Chart:', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-followers-growth');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        // Re-create chart with same config
                        new Chart(retryCtx, {
                            type: 'line',
                            data: {
                                labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                                datasets: [{
                                    label: 'فالوور اینستاگرام',
                                    data: [143000, 150000, 160000, 170000],
                                    borderColor: YEKTANET_COLORS.saffron,
                                    backgroundColor: 'rgba(243, 196, 46, 0.1)',
                                    tension: 0.4,
                                    fill: true,
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                    pointBackgroundColor: YEKTANET_COLORS.gold,
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                                        padding: 12,
                                        callbacks: {
                                            label: function(context) {
                                                return context.parsed.y.toLocaleString('fa-IR') + ' نفر';
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: false,
                                        min: 140000,
                                        max: 175000,
                                        ticks: {
                                            callback: function(value) {
                                                return (value / 1000).toLocaleString('fa-IR') + 'K';
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        console.log('✅ Followers Growth Chart initialized (retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing Followers Chart (retry):', e2);
                }
            }, 1000);
        }
    }

    // 2. Engagement Rate Growth
    const engagementCtx = document.getElementById('chart-engagement-growth');
    if (engagementCtx) {
        try {
            const existingChart = Chart.getChart(engagementCtx);
            if (existingChart) existingChart.destroy();
            
            new Chart(engagementCtx, {
                type: 'line',
                data: {
                    labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                    datasets: [{
                        label: 'نرخ تعامل (%)',
                        data: [0, 2, 4, 5],
                        borderColor: '#fd6f95',
                        backgroundColor: 'rgba(253, 111, 149, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#fd6f95',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(50, 50, 50, 0.9)',
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y + '%';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 6,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Engagement Growth Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Engagement Chart:', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-engagement-growth');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        // Re-create chart
                        new Chart(retryCtx, {
                            type: 'line',
                            data: {
                                labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                                datasets: [{
                                    label: 'نرخ تعامل (%)',
                                    data: [0, 2, 4, 5],
                                    borderColor: '#fd6f95',
                                    backgroundColor: 'rgba(253, 111, 149, 0.1)',
                                    tension: 0.4,
                                    fill: true,
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                    pointBackgroundColor: '#fd6f95',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                                        padding: 12,
                                        callbacks: {
                                            label: function(context) {
                                                return context.parsed.y + '%';
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 6,
                                        ticks: {
                                            callback: function(value) {
                                                return value + '%';
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        console.log('✅ Engagement Growth Chart initialized (retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing Engagement Chart (retry):', e2);
                }
            }, 1000);
        }
    }

    // 3. Website Traffic Growth
    const trafficCtx = document.getElementById('chart-traffic-growth');
    if (trafficCtx) {
        try {
            const existingChart = Chart.getChart(trafficCtx);
            if (existingChart) existingChart.destroy();
            
            new Chart(trafficCtx, {
                type: 'line',
                data: {
                    labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                    datasets: [{
                        label: 'ترافیک وب‌سایت',
                        data: [0, 8000, 15000, 25000],
                        borderColor: '#17b1fd',
                        backgroundColor: 'rgba(23, 177, 253, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#17b1fd',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(50, 50, 50, 0.9)',
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y.toLocaleString('fa-IR') + ' بازدید';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 30000,
                            ticks: {
                                callback: function(value) {
                                    if (value >= 1000) {
                                        return (value / 1000).toLocaleString('fa-IR') + 'K';
                                    }
                                    return value.toLocaleString('fa-IR');
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Traffic Growth Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Traffic Chart:', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-traffic-growth');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        // Re-create chart
                        new Chart(retryCtx, {
                            type: 'line',
                            data: {
                                labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                                datasets: [{
                                    label: 'ترافیک وب‌سایت',
                                    data: [0, 8000, 15000, 25000],
                                    borderColor: '#17b1fd',
                                    backgroundColor: 'rgba(23, 177, 253, 0.1)',
                                    tension: 0.4,
                                    fill: true,
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                    pointBackgroundColor: '#17b1fd',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                                        padding: 12,
                                        callbacks: {
                                            label: function(context) {
                                                return context.parsed.y.toLocaleString('fa-IR') + ' بازدید';
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 30000,
                                        ticks: {
                                            callback: function(value) {
                                                if (value >= 1000) {
                                                    return (value / 1000).toLocaleString('fa-IR') + 'K';
                                                }
                                                return value.toLocaleString('fa-IR');
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        console.log('✅ Traffic Growth Chart initialized (retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing Traffic Chart (retry):', e2);
                }
            }, 1000);
        }
    }

    // 4. Google Rating Growth
    const ratingCtx = document.getElementById('chart-rating-growth');
    if (ratingCtx) {
        try {
            const existingChart = Chart.getChart(ratingCtx);
            if (existingChart) existingChart.destroy();
            
            new Chart(ratingCtx, {
                type: 'line',
                data: {
                    labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                    datasets: [{
                        label: 'امتیاز گوگل',
                        data: [3.8, 4.0, 4.2, 4.3],
                        borderColor: '#2fbea8',
                        backgroundColor: 'rgba(47, 190, 168, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#2fbea8',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(50, 50, 50, 0.9)',
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y.toFixed(1) + ' ⭐';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 3.5,
                            max: 4.5,
                            ticks: {
                                callback: function(value) {
                                    return value.toFixed(1) + ' ⭐';
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Rating Growth Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Rating Chart:', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-rating-growth');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        // Re-create chart
                        new Chart(retryCtx, {
                            type: 'line',
                            data: {
                                labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                                datasets: [{
                                    label: 'امتیاز گوگل',
                                    data: [3.8, 4.0, 4.2, 4.3],
                                    borderColor: '#2fbea8',
                                    backgroundColor: 'rgba(47, 190, 168, 0.1)',
                                    tension: 0.4,
                                    fill: true,
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                    pointBackgroundColor: '#2fbea8',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                                        padding: 12,
                                        callbacks: {
                                            label: function(context) {
                                                return context.parsed.y.toFixed(1) + ' ⭐';
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: false,
                                        min: 3.5,
                                        max: 4.5,
                                        ticks: {
                                            callback: function(value) {
                                                return value.toFixed(1) + ' ⭐';
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        console.log('✅ Rating Growth Chart initialized (retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing Rating Chart (retry):', e2);
                }
            }, 1000);
        }
    }

    // 5. Club Members Growth
    const membersCtx = document.getElementById('chart-members-growth');
    if (membersCtx) {
        try {
            const existingChart = Chart.getChart(membersCtx);
            if (existingChart) existingChart.destroy();
            
            new Chart(membersCtx, {
                type: 'line',
                data: {
                    labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                    datasets: [{
                        label: 'اعضای باشگاه',
                        data: [0, 500, 1200, 2000],
                        borderColor: '#8763f8',
                        backgroundColor: 'rgba(135, 99, 248, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#8763f8',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(50, 50, 50, 0.9)',
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y.toLocaleString('fa-IR') + ' نفر';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 2500,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString('fa-IR');
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Members Growth Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Members Chart:', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-members-growth');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        // Re-create chart
                        new Chart(retryCtx, {
                            type: 'line',
                            data: {
                                labels: ['آذر', 'دی', 'بهمن', 'اسفند'],
                                datasets: [{
                                    label: 'اعضای باشگاه',
                                    data: [0, 500, 1200, 2000],
                                    borderColor: '#8763f8',
                                    backgroundColor: 'rgba(135, 99, 248, 0.1)',
                                    tension: 0.4,
                                    fill: true,
                                    pointRadius: 6,
                                    pointHoverRadius: 8,
                                    pointBackgroundColor: '#8763f8',
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 2
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                                        padding: 12,
                                        callbacks: {
                                            label: function(context) {
                                                return context.parsed.y.toLocaleString('fa-IR') + ' نفر';
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 2500,
                                        ticks: {
                                            callback: function(value) {
                                                return value.toLocaleString('fa-IR');
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        console.log('✅ Members Growth Chart initialized (retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing Members Chart (retry):', e2);
                }
            }, 1000);
        }
    }
    
    // KPI Progress Chart (in Goals section - if exists)
    const kpiCtxGoals = document.getElementById('chart-kpi-progress-goals');
    if (kpiCtxGoals) {
        try {
            const existingChart = Chart.getChart(kpiCtxGoals);
            if (existingChart) {
                existingChart.destroy();
            }
            new Chart(kpiCtxGoals, ChartTemplates.kpiProgress);
            console.log('✅ KPI Progress Chart initialized (Goals section)');
        } catch (e) {
            console.error('❌ Error initializing KPI Progress Chart (Goals):', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-kpi-progress-goals');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        new Chart(retryCtx, ChartTemplates.kpiProgress);
                        console.log('✅ KPI Progress Chart initialized (Goals section - retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing KPI Progress Chart (Goals - retry):', e2);
                }
            }, 1000);
        }
    }

    // Timeline Gantt Chart
    const timelineCtx = document.getElementById('chart-timeline-gantt');
    if (timelineCtx) {
        try {
            const existingChart = Chart.getChart(timelineCtx);
            if (existingChart) {
                existingChart.destroy();
            }
        new Chart(timelineCtx, ChartTemplates.timelineGantt);
            console.log('✅ Timeline Gantt Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Timeline Gantt Chart:', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-timeline-gantt');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        new Chart(retryCtx, ChartTemplates.timelineGantt);
                        console.log('✅ Timeline Gantt Chart initialized (retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing Timeline Gantt Chart (retry):', e2);
                }
            }, 1000);
        }
    } else {
        console.warn('⚠️ chart-timeline-gantt element not found');
    }

    // Rating Progress Chart
    const ratingProgressCtx = document.getElementById('chart-rating-progress');
    if (ratingProgressCtx) {
        try {
            const existingChart = Chart.getChart(ratingCtx);
            if (existingChart) {
                existingChart.destroy();
            }
        new Chart(ratingCtx, ChartTemplates.ratingProgress);
            console.log('✅ Rating Progress Chart initialized');
        } catch (e) {
            console.error('❌ Error initializing Rating Progress Chart:', e);
            // Retry after a delay
            setTimeout(() => {
                try {
                    const retryCtx = document.getElementById('chart-rating-progress');
                    if (retryCtx) {
                        const existingChart = Chart.getChart(retryCtx);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                        new Chart(retryCtx, ChartTemplates.ratingProgress);
                        console.log('✅ Rating Progress Chart initialized (retry)');
                    }
                } catch (e2) {
                    console.error('❌ Error initializing Rating Progress Chart (retry):', e2);
                }
            }, 1000);
        }
    }
    
    console.log('✅ All charts initialization completed');
}

// Don't auto-initialize on DOM ready - let main.js handle it after sections load
// This ensures sections are loaded before charts are initialized

// Don't auto-initialize on DOM ready - let main.js handle it after sections load
// This ensures sections are loaded before charts are initialized

// Make charts editable
function makeChartEditable(chartId, datasetIndex = 0) {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;

    const chart = Chart.getChart(chartElement);
    if (!chart) return;

    // Add click event to edit data
    chartElement.addEventListener('click', (e) => {
        const activePoints = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
        
        if (activePoints.length > 0) {
            const firstPoint = activePoints[0];
            const label = chart.data.labels[firstPoint.index];
            const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];

            const newValue = prompt(`ویرایش مقدار برای "${label}":\n(مقدار فعلی: ${value})`, value);
            
            if (newValue !== null && !isNaN(newValue)) {
                chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index] = parseFloat(newValue);
                chart.update();

                // Save to localStorage
                saveChartData(chartId, chart.data);
            }
        }
    });
}

// Save chart data
function saveChartData(chartId, data) {
    const chartData = {};
    chartData[chartId] = data;
    localStorage.setItem('chart_data', JSON.stringify(chartData));
}

// Load saved chart data
function loadChartData(chartId) {
    const saved = localStorage.getItem('chart_data');
    if (saved) {
        const data = JSON.parse(saved);
        return data[chartId] || null;
    }
    return null;
}

// Export chart as image
function exportChartAsImage(chartId, filename) {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;

    const chart = Chart.getChart(chartElement);
    if (!chart) return;

    const url = chart.toBase64Image();
    const link = document.createElement('a');
    link.download = filename || `${chartId}.png`;
    link.href = url;
    link.click();
}

// Dynamic Budget Calculation
// Helper function to convert Persian digits to English
function persianToEnglish(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = str;
    for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(persianDigits[i], 'g'), englishDigits[i]);
    }
    return result;
}

// Helper function to extract number from text (handles both Persian and English)
function extractNumber(text) {
    if (!text) return 0;
    // Convert Persian to English
    let cleanText = persianToEnglish(text.toString());
    // Remove commas and non-digit characters
    cleanText = cleanText.replace(/,/g, '').replace(/[^\d.]/g, '');
    const num = parseFloat(cleanText);
    return isNaN(num) ? 0 : num;
}

function updateBudgetTotal() {
    // Get total budget from display or use default
    const totalBudgetElement = document.getElementById('total-budget-display') || 
                                document.querySelector('[data-field="total-budget"]');
    let TOTAL_BUDGET = 1800000000; // Default: 1.8 billion
    
    if (totalBudgetElement) {
        TOTAL_BUDGET = extractNumber(totalBudgetElement.textContent);
        if (TOTAL_BUDGET === 0) {
            TOTAL_BUDGET = 1800000000; // Fallback to default
        }
    }
    
    // Get all budget items
    const budgetItems = document.querySelectorAll('.budget-item');
    let totalSpent = 0;
    
    // Calculate total spent
    budgetItems.forEach(item => {
        const value = extractNumber(item.textContent);
        totalSpent += value;
    });
    
    // Calculate capacity (available budget)
    const capacity = TOTAL_BUDGET - totalSpent;
    
    // Update capacity amount
    const capacityAmount = document.getElementById('capacity-amount');
    if (capacityAmount) {
        capacityAmount.textContent = capacity.toLocaleString('fa-IR');
    }
    
    // Update capacity percent
    const capacityPercent = document.getElementById('capacity-percent');
    if (capacityPercent) {
        const percent = TOTAL_BUDGET > 0 ? ((capacity / TOTAL_BUDGET) * 100).toFixed(1) : '0.0';
        capacityPercent.textContent = percent + '٪';
        
        // Update color based on capacity value
        capacityPercent.className = 'capacity-percent px-3 py-1 rounded-full text-sm font-bold';
        const capacityRow = document.getElementById('capacity-row');
        
        if (capacity > 0) {
            // Positive = Yellow
            capacityPercent.classList.add('bg-yellow-100', 'text-yellow-700');
            if (capacityRow) {
                capacityRow.classList.remove('bg-red-50', 'bg-green-50');
                capacityRow.classList.add('bg-yellow-50');
            }
            if (capacityAmount) {
                capacityAmount.className = 'capacity-amount text-yellow-700';
            }
        } else if (capacity < 0) {
            // Negative = Red
            capacityPercent.classList.add('bg-red-100', 'text-red-700');
            if (capacityRow) {
                capacityRow.classList.remove('bg-yellow-50', 'bg-green-50');
                capacityRow.classList.add('bg-red-50');
            }
            if (capacityAmount) {
                capacityAmount.className = 'capacity-amount text-red-700';
            }
        } else {
            // Zero = Green
            capacityPercent.classList.add('bg-green-100', 'text-green-700');
            if (capacityRow) {
                capacityRow.classList.remove('bg-yellow-50', 'bg-red-50');
                capacityRow.classList.add('bg-green-50');
            }
            if (capacityAmount) {
                capacityAmount.className = 'capacity-amount text-green-700';
            }
        }
    }
    
    // Update total calculated
    const totalCalculated = document.getElementById('budget-total-calculated');
    if (totalCalculated) {
        totalCalculated.textContent = totalSpent.toLocaleString('fa-IR');
    }
    
    // Update all percentages based on TOTAL_BUDGET
    budgetItems.forEach(item => {
        const value = extractNumber(item.textContent);
        const field = item.getAttribute('data-field');
        
        if (TOTAL_BUDGET > 0 && value > 0) {
            const percent = ((value / TOTAL_BUDGET) * 100).toFixed(1);
            
            // Update percentage badge
            const percentElement = document.querySelector(`.budget-percent[data-field="${field}"]`);
            if (percentElement) {
                percentElement.textContent = percent + '٪';
            }
        }
    });
    
    // Update budget chart if exists
    const budgetChart = Chart.getChart(document.getElementById('chart-budget-distribution'));
    if (budgetChart) {
        const newData = Array.from(budgetItems).map(item => {
            return extractNumber(item.textContent);
        });
        budgetChart.data.datasets[0].data = newData;
        budgetChart.update();
    }
}

// Initialize budget calculation on load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for sections to load
    setTimeout(() => {
        if (document.getElementById('capacity-amount') || document.querySelectorAll('.budget-item').length > 0) {
            updateBudgetTotal();
        }
    }, 1000);
    
    // Also retry after a longer delay to ensure sections are loaded
    setTimeout(() => {
        if (document.querySelectorAll('.budget-item').length > 0) {
            updateBudgetTotal();
        }
    }, 3000);
    
    // Listen for changes in budget items
    document.addEventListener('blur', function(e) {
        if (e.target.classList.contains('budget-item') || e.target.classList.contains('editable-number')) {
            setTimeout(() => {
                updateBudgetTotal();
            }, 100);
        }
    }, true);
    
    // Also listen for input events on editable numbers
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('budget-item') || e.target.classList.contains('editable-number')) {
            // Don't update on every input, only on blur
        }
    }, true);
});