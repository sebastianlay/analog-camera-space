Vue.createApp({
  data() {
    return {
    currentcameras: currentcameras,
    search: '',
    type: 'all',
    format: 'all',
    sortBy: 'popularity',
    sortDir: 'desc'
    }
  },
  computed: {
    searchedcameras: function() {
      if(this.search) {
        var searchTerms = this.search.toLowerCase().split(' ');
        return this.currentcameras.filter(function (camera) {
          const name = camera.name.toLowerCase();
          const description = camera.description.toLowerCase();
          const maker = camera.maker.toLowerCase();
          const matches = (searchTerm) => name.includes(searchTerm) || description.includes(searchTerm) || maker.includes(searchTerm);
          return searchTerms.every(matches);
        });
      } else {
        return this.currentcameras;
      }
    },
    filteredcameras: function() {
      var format = this.format;
      var type = this.type;
      if(type === 'all' && format === 'all') {
        return this.searchedcameras;
      } else if(type === 'all' && format !== 'all') {
        return this.searchedcameras.filter(function (camera) {
          return format === camera.format;
        });
      } else if(this.type !== 'all' && this.format === 'all') {
        return this.searchedcameras.filter(function (camera) {
          return type === camera.type;
        });
      } else {
        return this.searchedcameras.filter(function (camera) {
          return type === camera.type && format === camera.format;
        });
      }
    },
    sortedcameras: function() {
      var sortBy = this.sortBy;
      var sortDir = this.sortDir;
      var sorted = this.filteredcameras.sort(function (a, b) {
        var first = a.name.toLowerCase() + a.format;
        var second = b.name.toLowerCase() + b.format;
        switch(sortBy) {
          case 'popularity':
            return a.popularity - b.popularity || first.localeCompare(second);
          case 'name':
            return first.localeCompare(second);
          case 'price':
            return a.price - b.price || first.localeCompare(second);
          case 'date':
            return a.launched - b.launched || first.localeCompare(second);
        }
      });
      if(sortDir === 'asc') {
        return sorted;
      } else {
        return sorted.reverse();
      }
    },
    cameras: function() {
      return this.sortedcameras;
    }
  },
  methods: {
    formatPrice: function(price) {
      return price === 0 ? 'free' : '€'.repeat(price);
    },
    reset: function() {
      this.search = '';
      this.type = 'all';
      this.format = 'all';
    },
    sort: function(button) {
      if(this.sortBy === button.target.innerText.toLowerCase()) {
        this.sortDir === 'asc' ? this.sortDir = 'desc' : this.sortDir = 'asc';
      } else {
        this.sortBy = button.target.innerText.toLowerCase();
      }
    },
    toggle: function() {
      if(document.querySelector('body').classList.contains('dark')) {
        localStorage.setItem('theme', 'light');
        document.querySelector('body').classList.remove('dark');
      } else {
        localStorage.setItem('theme', 'dark');
        document.querySelector('body').classList.add('dark');
      }
    }
  },
  mounted: function() {
    if(localStorage.getItem('theme') !== 'dark') {
      document.querySelector('body').classList.remove('dark');
    }
  }
}).mount('#app');
