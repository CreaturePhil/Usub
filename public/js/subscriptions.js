var subscriptions = {

  init: function() {
    if ($('#subscriptions').length >= 1) {
      this.setCSRFToken($('meta[name="csrf-token"]').attr('content'));

      $.ajax('/api/users/' + this.els.addForm.data('id'), {
        dataType: 'json',
        success: this.show.bind(this),
        complete: function() {
          $('#spinner').hide();
        }
      });
      
      this.els.addForm.on('submit', this.update.bind(this)); 
      this.els.list.on('click', '.glyphicon-remove', this.remove);
    }
  },

  els: {
    'addForm': $('#addSub'),
    'list': $('#subsList'),
    'searchInput': $('#searchSub')
  },

  data: {
    subs: [],
    loading: false
  },

  setCSRFToken: function(securityToken) {
    $.ajaxPrefilter(function(options, _, xhr) {
      if (!xhr.crossDomain) {
        xhr.setRequestHeader('X-CSRF-Token', securityToken);
      }
    });
  },

  cleanInput: function(input) {
    return input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
  },

  show: function(res) {
    $.each(res.subscriptions, this.render.bind(this));
  },

  render: function(index, sub) {
    sub = this.cleanInput(sub);
    var display = '<tr class="removeSub" data-sub="' + sub + '">' +
                  '<td><a href="/user/' + sub + '">' + sub + '</a></td>' +
                  '<td><span class="glyphicon glyphicon-remove"></span></td>' +
                  '</tr>';
    this.els.list.append(display);
    this.data.subs.push(sub.toLowerCase());
  },

  update: function(e) {
    e.preventDefault();

    if (this.data.loading) {
      return;
    }

    var input = this.cleanInput(this.els.searchInput.val().toLowerCase());
    if (this.data.subs.indexOf(input) >= 0) {
      return $('.top-right').notify({
        type: 'danger',
        message: { text: 'You already added ' + this.els.searchInput.val() + '.'  }
      }).show();
    }

    this.data.loading = true;

    var req = $.ajax(this.els.addForm.attr('action'), { 
      type: 'PUT',
      dataType: 'json',
      data: { 'addSub': this.els.searchInput.val() },
    });

    var success = function(res) {
      var searchInput = this.els.searchInput;
      var value = this.cleanInput(searchInput.val());
      var display = '<tr class="removeSub" data-sub="' + value + '">' +
                    '<td class="highlight"><a href="/user/' + value + '">' + value + '</a></td>' +
                    '<td class="highlight"><span class="glyphicon glyphicon-remove"></span></td>' +
                    '</tr>';
      this.els.list.prepend(display);
      this.data.subs.push(value.toLowerCase());
      this.data.loading = false;
      searchInput.val('');
      setTimeout(function() {
        $('.highlight').removeClass('highlight');
      }, 1000);
    };

    var error = function(err, status, msg) {
      console.log(status + msg);
      this.data.loading = false;
    };

    req.then(success.bind(this), error.bind(this));
  },

  remove: function() {
    subscriptions.tempEl = $(this).closest('.removeSub');
    $.ajax('/api/users/' + subscriptions.els.addForm.data('id'), { 
      type: 'PUT',
      dataType: 'json',
      context: subscriptions,
      data: { 'removeSub': subscriptions.tempEl.data('sub') },
      success: function(res) {
        var removeSub = subscriptions.tempEl.closest('.removeSub');
        delete subscriptions.tempEl;
        this.data.subs.splice(this.data.subs.indexOf(removeSub.data('sub')), 1);
        removeSub.remove();
      },
      error: function(err, status, msg) {
        console.log(status + msg);
      }
    });
  }

};

$(function() { subscriptions.init(); });
