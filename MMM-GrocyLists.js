/* eslint-disable no-restricted-syntax */
/* global Module */

/* Magic Mirror
 * Module: MMM-GrocyLists
 *
 * By Jordan Welch
 * MIT Licensed.
 */

Module.register('MMM-GrocyLists', {
  defaults: {
    grocyURL:       '', // The API of your Grocy instance.
    grocyAPIKey:    '', // The API Key of your Grocy Instance
    widgetType:     'chores',
    proxyCORS:      false,
    updateInterval: 300000, // 10 Minutes
    retryDelay:     5000,
    tableClass:     'small',
	choreFilter: 0,
  },

  requiresVersion: '2.1.0', // Required version of MagicMirror

  start() {
    const self = this;
    const dataRequest = null;
    const dataNotification = null;

    // Flag for check if module is loaded
    this.loaded = false;

    // Schedule update timer.
    this.getData();
    setInterval(() => {
      self.updateDom();
    }, this.config.updateInterval);
  },
  /*
  * Format the URL for a given API Endpoint. Will pass trhough CORS proxy
  * if specified in settings.
  */
  APIEndpoint(endpoint) {
    if (this.config.proxyCORS) {
      return `https://cors-anywhere.herokuapp.com/${this.config.grocyURL}/api/${endpoint}`;
    }
    return `${this.config.grocyURL}/api/${endpoint}`;
  },
  /*
     * getData
     * function example return data and show it in the module wrapper
     * get a URL request
     *
     */
  getData() {
    const self = this;

    let retry = true;

    const dataRequest = new XMLHttpRequest();
    dataRequest.open('GET', self.APIEndpoint('chores'), true);
    dataRequest.setRequestHeader('GROCY-API-KEY', this.config.grocyAPIKey);
    dataRequest.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          self.processData(JSON.parse(this.response));
        } else if (this.status === 401) {
          self.updateDom(self.config.animationSpeed);
          Log.error(self.name, this.status);
          retry = false;
        } else {
          Log.error(self.name, 'Could not load data.');
        }
        if (retry) {
          self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
        }
      }
    };
    dataRequest.send();
  },

  /* scheduleUpdate()
     * Schedule next update.
     *
     * argument delay number - Milliseconds before next update.
     *  If empty, this.config.updateInterval is used.
     */
  scheduleUpdate(delay) {
    let nextLoad = this.config.updateInterval;
    if (typeof delay !== 'undefined' && delay >= 0) {
      nextLoad = delay;
    }
    nextLoad = nextLoad;
    const self = this;
    setTimeout(() => {
      self.getData();
    }, nextLoad);
  },

  createChoreList() {
    const chores = [];
    const NULLDATE = '2999-12-31 23:59:59';
	// Define second, minute, hour, and day variables
        const oneSecond = 1000; // 1,000 milliseconds
        const oneMinute = oneSecond * 60;
        const oneHour = oneMinute * 60;
        const oneDay = oneHour * 24;
	
    if (this.dataRequest) {
      // const today = moment().startOf('day');
	  const now = new Date();
	

      for (const c in this.dataRequest) {
        if (Object.prototype.hasOwnProperty.call(this.dataRequest, c)) {
          const drChore = this.dataRequest[c];

          if (this.config.choreFilter > 0 && drChore.next_estimated_execution_time !== NULLDATE && Date.parse(drChore.next_estimated_execution_time) - now < this.config.choreFilter * oneDay && Date.parse(drChore.next_estimated_execution_time) - now > 0) {
            const chore = {};

            chore.title = drChore.chore_name;
            chore.startDate = Date.parse(drChore.next_estimated_execution_time);

            chores.push(chore);
          }
		  else if(drChore.next_estimated_execution_time !== NULLDATE && this.config.choreFilter === 0){
            const chore = {};

            chore.title = drChore.chore_name;
            chore.startDate = Date.parse(drChore.next_estimated_execution_time);

            chores.push(chore);
          }
        }
      }
    }

    chores.sort((a, b) => {
      // Use toUpperCase() to ignore character casing
      const startDateA = a.startDate;
      const startDateB = b.startDate;

      let comparison = 0;
      if (startDateA > startDateB) {
        comparison = 1;
      } else if (startDateA < startDateB) {
        comparison = -1;
      }
      return comparison;
    });

    return chores;
  },

  /* capFirst(string)
	 * Capitalize the first letter of a string
	 * Return capitalized string
	 */
  capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  getDom() {
    const self = this;

    const wrapper = document.createElement('table');
    // If this.dataRequest is not empty

    const chores = this.createChoreList();

    wrapper.className = this.config.tableClass;

    if (chores.length === 0) {
      wrapper.innerHTML = this.loaded ? this.translate('EMPTY') : this.translate('LOADING');
      wrapper.className = `${this.config.tableClass} dimmed`;
      return wrapper;
    }

    for (const c in chores) {
      if (Object.prototype.hasOwnProperty.call(chores, c)) {
        const chore = chores[c];
        const choreWrapper = document.createElement('tr');

        choreWrapper.className = 'normal';

        const titleWrapper = document.createElement('td');
        titleWrapper.innerHTML = chore.title;
        titleWrapper.className = 'title bright';

        const timeWrapper = document.createElement('td');
        choreWrapper.appendChild(titleWrapper);

        const now = new Date();
        // Define second, minute, hour, and day variables
        const oneSecond = 1000; // 1,000 milliseconds
        const oneMinute = oneSecond * 60;
        const oneHour = oneMinute * 60;
        const oneDay = oneHour * 24;

        if (chore.today) {
          timeWrapper.innerHTML = this.capFirst(this.translate('TODAY'));
        } else if (chore.startDate - now < oneDay && chore.startDate - now > 0) {
          timeWrapper.innerHTML = this.capFirst(this.translate('TOMORROW'));
        } else if (chore.startDate - now < 2 * oneDay && chore.startDate - now > 0) {
          if (this.translate('DAYAFTERTOMORROW') !== 'DAYAFTERTOMORROW') {
            timeWrapper.innerHTML = this.capFirst(this.translate('DAYAFTERTOMORROW'));
          } else {
            timeWrapper.innerHTML = this.capFirst(moment(chore.startDate, 'x').fromNow());
          }
        } else {
          timeWrapper.innerHTML = this.capFirst(moment(chore.startDate, 'x').from(moment().format('YYYYMMDD')));
        }
        choreWrapper.appendChild(timeWrapper);
        wrapper.appendChild(choreWrapper);
      }
    }
    return wrapper;
  },

  getScripts() {
    return [];
  },

  getStyles() {
    return [
      'MMM-GrocyLists.css',
    ];
  },

  // Load translations files
  getTranslations() {
    // FIXME: This can be load a one file javascript definition
    return {
      en: 'translations/en.json',
      es: 'translations/es.json',
    };
  },

  processData(data) {
    const self = this;
    this.dataRequest = data;
    if (this.loaded === false) { self.updateDom(self.config.animationSpeed); }
    this.loaded = true;

    // the data if load
    // send notification to helper
    this.sendSocketNotification('MMM-GrocyLists-NOTIFICATION_TEST', data);
  },

  // socketNotificationReceived from helper
  socketNotificationReceived(notification, payload) {
    if (notification === 'MMM-GrocyLists-NOTIFICATION_TEST') {
      // set dataNotification
      this.dataNotification = payload;
      this.updateDom();
    }
  },
});
