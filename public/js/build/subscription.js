// DON'T FORGET TO EMULATE IT SO IT FEELS FAST
var SubscriptionBox = React.createClass({displayName: "SubscriptionBox",
  getInitialState: function() {
    return { data: [] };
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
        var $spinner = $('#spinner');
        if ($spinner.length >= 0) $spinner.hide();
      },
    })
    .success(function(data) {
        this.setState({ data: data.subscriptions }); 
    }.bind(this))
  },
  componentDidMount: function() {
    this.setCSRFToken($('meta[name="csrf-token"]').attr('content'));
    this.loadSubscriptionsFromServer();
  },
  handleSubscriptionSubmit: function(sub) {
    $.ajax(this.props.url, { type: 'PUT', dataType: 'json', data: { 'addSub': sub } })
      .success(function(data) {
        console.log(data);
        this.loadSubscriptionsFromServer();
      }.bind(this))
      .error(function(xhr, status, err) {
        console.error(this.props.url, status, err.toString()); 
      });
  },
  render: function() {
    console.log(this.state.data);
    return (
      React.createElement("div", {className: "subscriptionBox"}, 
        React.createElement(SubscriptionForm, {onSubscriptionSubmit:  this.handleSubscriptionSubmit}), 
        React.createElement("h1", {id: "spinner", className: "text-center"}, 
          React.createElement("span", {className: "fa fa-spinner fa-spin fa-2x"})
        ), 
        React.createElement(SubscriptionList, {data:  this.state.data})
      )
    );
  }
});

var SubscriptionForm = React.createClass({displayName: "SubscriptionForm",
  handleSubmit: function(e) {
    e.preventDefault(); 
    this.props.onSubscriptionSubmit(this.refs.name.getDOMNode().value.trim());
    this.refs.name.getDOMNode().value = '';
  },
  render: function() {
    return (React.createElement("form", {className: "subscriptionForm", onSubmit:  this.handleSubmit}, 
      React.createElement("div", {className: "form-group"}, 
        React.createElement("input", {id: "searchSub", type: "text", placeholder: "Add a subscription", ref: "name", required: true}), 
        ' ', 
        React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Add")
      )
    ));
  }
});

var SubscriptionList = React.createClass({displayName: "SubscriptionList",
  render: function() {
    var subNodes = this.props.data.map(function(sub) { 
      return (
        React.createElement(Subscription, {name: sub, key: sub })
      );
    });
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
  render: function() {
    return (
      React.createElement("tr", {className: "subscription"}, 
        React.createElement("td", null, React.createElement("a", {href:  '/user/' + this.props.name},  this.props.name)), 
        React.createElement("td", null, React.createElement("span", {className: "glyphicon glyphicon-remove"}))
      )
    );
  }
});

var subscriptionsEl = document.getElementById('subscriptions');
React.render(
  React.createElement(SubscriptionBox, {url:  '/api/users/' + subscriptionsEl.getAttribute('data-id')}),
  subscriptionsEl
);
