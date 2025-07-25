(function(global) {
  'use strict';

  function GitHubCalendar(selector, username, options) {
    if (typeof selector === 'string') {
      selector = document.querySelector(selector);
    }
    
    if (!selector) {
      throw new Error('GitHub Calendar: Element not found');
    }
    
    if (!username) {
      throw new Error('GitHub Calendar: Username is required');
    }

    const defaults = {
      responsive: true,
      tooltips: true,
      summary_text: 'contributions in the last year',
      proxy: '',
      global_stats: true,
      cache: true
    };

    const settings = Object.assign({}, defaults, options || {});
    
    let contributionData = null;
    let tooltip = null;

    function createTooltip() {
      if (!settings.tooltips) return;
      
      tooltip = document.createElement('div');
      tooltip.className = 'github-calendar-tooltip';
      tooltip.style.display = 'none';
      document.body.appendChild(tooltip);
    }

    function showTooltip(event, data) {
      if (!tooltip || !settings.tooltips) return;
      
      const rect = event.target.getBoundingClientRect();
      const count = data.count;
      const date = new Date(data.date);
      const dateStr = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      tooltip.textContent = `${count} contribution${count !== 1 ? 's' : ''} on ${dateStr}`;
      tooltip.style.display = 'block';
      tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
    }

    function hideTooltip() {
      if (!tooltip) return;
      tooltip.style.display = 'none';
    }

    function getContributionLevel(count) {
      if (count === 0) return 0;
      if (count <= 3) return 1;
      if (count <= 6) return 2;
      if (count <= 9) return 3;
      return 4;
    }

    function createCalendarSVG(data) {
      const weeks = data.weeks;
      const cellSize = 10;
      const cellPadding = 2;
      const monthLabelHeight = 15;
      const dayLabelWidth = 25;
      
      const width = weeks.length * (cellSize + cellPadding) + dayLabelWidth;
      const height = 7 * (cellSize + cellPadding) + monthLabelHeight;

      let svg = `<svg class="github-calendar-graph-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
      
      // Month labels
      let currentMonth = '';
      weeks.forEach((week, weekIndex) => {
        if (week.days.length > 0) {
          const firstDay = new Date(week.days[0].date);
          const monthName = firstDay.toLocaleDateString('en-US', { month: 'short' });
          
          if (monthName !== currentMonth && weekIndex % 4 === 0) {
            currentMonth = monthName;
            const x = weekIndex * (cellSize + cellPadding) + dayLabelWidth;
            svg += `<text x="${x}" y="10" class="month" font-size="10" fill="#656d76">${monthName}</text>`;
          }
        }
      });

      // Day labels
      const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
      dayLabels.forEach((day, dayIndex) => {
        if (day) {
          const y = dayIndex * (cellSize + cellPadding) + monthLabelHeight + cellSize;
          svg += `<text x="5" y="${y}" class="day" font-size="9" fill="#656d76" text-anchor="start">${day}</text>`;
        }
      });

      // Calendar grid
      weeks.forEach((week, weekIndex) => {
        week.days.forEach((day, dayIndex) => {
          const x = weekIndex * (cellSize + cellPadding) + dayLabelWidth;
          const y = dayIndex * (cellSize + cellPadding) + monthLabelHeight;
          const level = getContributionLevel(day.count);
          
          svg += `<rect 
            class="github-calendar-day github-calendar-square-${level}" 
            data-count="${day.count}" 
            data-date="${day.date}"
            x="${x}" 
            y="${y}" 
            width="${cellSize}" 
            height="${cellSize}" 
            rx="2"
            fill="var(--color-calendar-graph-day-L${level}-bg, ${getColor(level)})"
          ></rect>`;
        });
      });

      svg += '</svg>';
      return svg;
    }

    function getColor(level) {
      const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
      return colors[level] || colors[0];
    }

    function createLegend() {
      return `
        <div class="github-calendar-legend">
          <span class="github-calendar-legend-text">Less</span>
          <div class="github-calendar-legend-squares">
            <div class="github-calendar-square github-calendar-square-0"></div>
            <div class="github-calendar-square github-calendar-square-1"></div>
            <div class="github-calendar-square github-calendar-square-2"></div>
            <div class="github-calendar-square github-calendar-square-3"></div>
            <div class="github-calendar-square github-calendar-square-4"></div>
          </div>
          <span class="github-calendar-legend-text">More</span>
        </div>
      `;
    }

    function generateMockData() {
      const weeks = [];
      const today = new Date();
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      
      let currentDate = new Date(oneYearAgo);
      
      // Start from the beginning of the week
      const dayOfWeek = currentDate.getDay();
      currentDate.setDate(currentDate.getDate() - dayOfWeek);
      
      while (currentDate <= today) {
        const week = { days: [] };
        
        for (let i = 0; i < 7; i++) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const count = Math.floor(Math.random() * 15); // Random contributions 0-14
          
          week.days.push({
            date: dateStr,
            count: count
          });
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        weeks.push(week);
      }
      
      return { weeks };
    }

    function fetchContributions(username) {
      return new Promise((resolve, reject) => {
        selector.innerHTML = '<div class="github-calendar-loading">Loading contributions...</div>';
        
        // Try to fetch real data from proxy first
        if (settings.proxy) {
          fetch(`${settings.proxy}?username=${encodeURIComponent(username)}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              resolve(data);
            })
            .catch(error => {
              console.warn('Failed to fetch real GitHub data, using mock data:', error);
              resolve(generateMockData());
            });
        } else {
          // Use mock data if no proxy is configured
          setTimeout(() => {
            resolve(generateMockData());
          }, 500);
        }
      });
    }

    function attachEventListeners() {
      if (!settings.tooltips) return;
      
      const days = selector.querySelectorAll('.github-calendar-day');
      days.forEach(day => {
        day.addEventListener('mouseenter', (e) => {
          const count = parseInt(e.target.getAttribute('data-count'));
          const date = e.target.getAttribute('data-date');
          showTooltip(e, { count, date });
        });
        
        day.addEventListener('mouseleave', hideTooltip);
        
        day.addEventListener('mousemove', (e) => {
          const count = parseInt(e.target.getAttribute('data-count'));
          const date = e.target.getAttribute('data-date');
          showTooltip(e, { count, date });
        });
      });
    }

    function render(data) {
      contributionData = data;
      
      const totalContributions = data.weeks.reduce((total, week) => {
        return total + week.days.reduce((weekTotal, day) => weekTotal + day.count, 0);
      }, 0);

      const calendarHTML = `
        <div class="github-calendar">
          <div class="github-calendar-graph">
            ${settings.global_stats ? `<div class="github-calendar-graph-title">
              ${totalContributions} ${settings.summary_text}
            </div>` : ''}
            <div class="github-calendar-graph-container">
              ${createCalendarSVG(data)}
              ${createLegend()}
            </div>
          </div>
        </div>
      `;

      selector.innerHTML = calendarHTML;
      createTooltip();
      attachEventListeners();
    }

    function handleError(error) {
      selector.innerHTML = `
        <div class="github-calendar-error">
          Failed to load GitHub contributions for ${username}
        </div>
      `;
      console.error('GitHub Calendar Error:', error);
    }

    // Initialize
    fetchContributions(username)
      .then(render)
      .catch(handleError);

    // Return public API
    return {
      reload: function() {
        fetchContributions(username)
          .then(render)
          .catch(handleError);
      },
      
      destroy: function() {
        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
        selector.innerHTML = '';
      }
    };
  }

  // Expose to global scope
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubCalendar;
  } else {
    global.GitHubCalendar = GitHubCalendar;
  }

})(typeof window !== 'undefined' ? window : this);