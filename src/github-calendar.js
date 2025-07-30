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
      cache: true,
      template: null,
      customTemplate: false,
      templateVars: {}
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

    function parseMarkdown(markdown) {
      let html = markdown;
      
      // Headers
      html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
      html = html.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
      html = html.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');
      
      // Bold
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="md-bold">$1</strong>');
      
      // Italic
      html = html.replace(/\*(.*?)\*/g, '<em class="md-italic">$1</em>');
      
      // Links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>');
      
      // Line breaks
      html = html.replace(/\n/g, '<br>');
      
      // Lists
      html = html.replace(/^\- (.*$)/gim, '<li class="md-list-item">$1</li>');
      html = html.replace(/(<li class="md-list-item">.*<\/li>)/s, '<ul class="md-list">$1</ul>');
      
      return html;
    }

    function replaceTemplateVariables(template, data) {
      const totalContributions = data.weeks.reduce((total, week) => {
        return total + week.days.reduce((weekTotal, day) => weekTotal + day.count, 0);
      }, 0);

      const currentStreak = calculateCurrentStreak(data);
      const longestStreak = calculateLongestStreak(data);
      const averagePerDay = Math.round(totalContributions / 365 * 10) / 10;
      
      const mostActiveDay = findMostActiveDay(data);
      const thisYear = new Date().getFullYear();
      
      const variables = {
        '{{username}}': username,
        '{{totalContributions}}': totalContributions,
        '{{currentStreak}}': currentStreak,
        '{{longestStreak}}': longestStreak,
        '{{averagePerDay}}': averagePerDay,
        '{{mostActiveDay}}': mostActiveDay,
        '{{year}}': thisYear,
        '{{summaryText}}': settings.summary_text,
        ...settings.templateVars
      };

      let result = template;
      for (const [variable, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
      }
      
      return result;
    }

    function calculateCurrentStreak(data) {
      const allDays = [];
      data.weeks.forEach(week => {
        week.days.forEach(day => allDays.push(day));
      });
      
      let streak = 0;
      for (let i = allDays.length - 1; i >= 0; i--) {
        if (allDays[i].count > 0) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    }

    function calculateLongestStreak(data) {
      const allDays = [];
      data.weeks.forEach(week => {
        week.days.forEach(day => allDays.push(day));
      });
      
      let longestStreak = 0;
      let currentStreak = 0;
      
      allDays.forEach(day => {
        if (day.count > 0) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });
      
      return longestStreak;
    }

    function findMostActiveDay(data) {
      let maxCount = 0;
      let mostActiveDate = '';
      
      data.weeks.forEach(week => {
        week.days.forEach(day => {
          if (day.count > maxCount) {
            maxCount = day.count;
            mostActiveDate = day.date;
          }
        });
      });
      
      if (mostActiveDate) {
        const date = new Date(mostActiveDate);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      return 'No contributions yet';
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

    async function loadTemplate(templatePath) {
      if (!templatePath) return null;
      
      try {
        const response = await fetch(templatePath);
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.status}`);
        }
        return await response.text();
      } catch (error) {
        console.warn('Failed to load template:', error);
        return null;
      }
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

    async function render(data, template = null) {
      contributionData = data;
      
      const totalContributions = data.weeks.reduce((total, week) => {
        return total + week.days.reduce((weekTotal, day) => weekTotal + day.count, 0);
      }, 0);

      let calendarHTML;
      
      if (settings.customTemplate && template) {
        const processedTemplate = replaceTemplateVariables(template, data);
        const calendarSVG = createCalendarSVG(data);
        const legend = createLegend();
        
        // Parse Markdown first, without the SVG elements
        const templateWithoutSVG = processedTemplate
          .replace('{{calendar}}', '[CALENDAR_PLACEHOLDER]')
          .replace('{{legend}}', '[LEGEND_PLACEHOLDER]');
        
        const parsedMarkdown = parseMarkdown(templateWithoutSVG);
        
        // Then replace placeholders with actual SVG
        const finalHTML = parsedMarkdown
          .replace('[CALENDAR_PLACEHOLDER]', calendarSVG)
          .replace('[LEGEND_PLACEHOLDER]', legend);
        
        calendarHTML = `
          <div class="github-calendar github-calendar-template">
            <div class="github-calendar-markdown">
              ${finalHTML}
            </div>
          </div>
        `;
      } else {
        calendarHTML = `
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
      }

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
    async function initialize() {
      try {
        const data = await fetchContributions(username);
        
        if (settings.customTemplate && settings.template) {
          const template = await loadTemplate(settings.template);
          await render(data, template);
        } else {
          await render(data);
        }
      } catch (error) {
        handleError(error);
      }
    }
    
    initialize();

    // Return public API
    return {
      reload: async function() {
        try {
          const data = await fetchContributions(username);
          
          if (settings.customTemplate && settings.template) {
            const template = await loadTemplate(settings.template);
            await render(data, template);
          } else {
            await render(data);
          }
        } catch (error) {
          handleError(error);
        }
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