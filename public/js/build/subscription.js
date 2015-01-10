var $spinner = $('#spinner');
var subscriptionsEl = document.getElementById('subscriptions');
var id = subscriptionsEl ? subscriptionsEl.getAttribute('data-id') : '';

var SubscriptionBox = React.createClass({displayName: "SubscriptionBox",
  getInitialState: function() {
    return {data: []};
  },
  setCSRFToken: function(securityToken) {
    $.ajaxPrefilter(function(options, _, xhr) {
      if (!xhr.crossDomain) {
        xhr.setRequestHeader('X-CSRF-Token', securityToken);
      }
    });
  },
  loadSubscriptionsFromServer: function() {
    $.ajax(this.props.url, {
      dataType: 'json',
      complete: function() { 
        if ($spinner.length >= 0) {
          $spinner.hide(); 
        }
      },
    })
    .success(function(data) {
      data.subscriptions.sort(function(a, b) {
        if (a.toLowerCase() < b.toLowerCase()) return -1;
        if (a.toLowerCase() > b.toLowerCase()) return 1;
        return 0;
      });
      this.setState({data: data.subscriptions}); 
    }.bind(this))
  },
  componentDidMount: function() {
    this.setCSRFToken($('#csrf').attr('content'));
    this.loadSubscriptionsFromServer();
  },
  handleSubscriptionEvent: function(type, sub) {
    var data = {};
    data[type] = sub;
    $.ajax(this.props.url, {type: 'PUT', dataType: 'json', data: data})
      .success(function(data) {
        this.loadSubscriptionsFromServer();
      }.bind(this))
      .error(function(xhr, status, err) {
        console.error(this.props.url, status, err.toString()); 
      });
  },
  handleSubscriptionSubmit: function(sub, getDOMNode) {
    var subs = this.state.data;
    if (subs.indexOf(sub.toLowerCase()) >= 0) {
      return $('.top-right').notify({
        type: 'danger',
        message: { text: 'You already added ' + sub + '.'  }
      }).show();
    }
    getDOMNode().value = '';
    this.handleSubscriptionEvent('addSub', sub);
  },
  handleSubscriptionRemove: function(sub) {
    this.handleSubscriptionEvent('removeSub', sub);
  },
  render: function() {
    return (
      React.createElement("div", {className: "subscriptionBox"}, 
        React.createElement(SubscriptionForm, {data: this.state.data, onSubscriptionSubmit: this.handleSubscriptionSubmit}), 
        React.createElement(SubscriptionList, {data: this.state.data, onSubscriptionRemove: this.handleSubscriptionRemove})
      )
    );
  }
});

var SubscriptionForm = React.createClass({displayName: "SubscriptionForm",
  handleSubmit: function(e) {
    e.preventDefault(); 
    this.props.onSubscriptionSubmit(this.refs.name.getDOMNode().value.trim(),
                                    this.refs.name.getDOMNode);
  },
  render: function() {
    return (React.createElement("form", {className: "subscriptionForm", onSubmit: this.handleSubmit}, 
      React.createElement("div", {className: "form-group"}, 
        React.createElement("input", {id: "searchSub", 
               type: "text", 
               placeholder: 'Add a subscription (Total Subscriptions: ' + this.props.data.length + ')', 
               ref: "name", 
               required: true}), 
        ' ', 
        React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Add")
      )
    ));
  }
});

var SubscriptionList = React.createClass({displayName: "SubscriptionList",
  passSubscriptionRemove: function(sub) {
    this.props.onSubscriptionRemove(sub);
  },
  render: function() {
    var subNodes = this.props.data.map(function(sub) { 
      return (
        React.createElement(Subscription, {name: sub, onSubscriptionRemove: this.passSubscriptionRemove}
        )
      );
    }.bind(this));
    return (
      React.createElement("table", {className: "table table-striped text-center subscriptionList"}, 
        React.createElement("tbody", null, 
          subNodes
        )
      )
    );
  }
});

var Subscription = React.createClass({displayName: "Subscription",
  handleClick: function() {
    this.props.onSubscriptionRemove(this.props.name);
  },
  render: function() {
    return (
      React.createElement("tr", {className: "subscription"}, 
        React.createElement("td", null, React.createElement("a", {href: '/user/' + this.props.name}, this.props.name)), 
        React.createElement("td", null, React.createElement("span", {className: "glyphicon glyphicon-remove", onClick: this.handleClick}))
      )
    );
  }
});

React.render(
  React.createElement(SubscriptionBox, {url: '/api/users/' + id}),
  subscriptionsEl
);
