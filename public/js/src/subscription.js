// DON'T FORGET TO EMULATE IT SO IT FEELS FAST
var SubscriptionBox = React.createClass({
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
      <div className="subscriptionBox">
        <SubscriptionForm onSubscriptionSubmit={ this.handleSubscriptionSubmit } />
        <h1 id="spinner" className="text-center">
          <span className="fa fa-spinner fa-spin fa-2x"></span>
        </h1>
        <SubscriptionList data={ this.state.data } />
      </div>
    );
  }
});

var SubscriptionForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault(); 
    this.props.onSubscriptionSubmit(this.refs.name.getDOMNode().value.trim());
    this.refs.name.getDOMNode().value = '';
  },
  render: function() {
    return (<form className="subscriptionForm" onSubmit={ this.handleSubmit }>
      <div className="form-group">
        <input id="searchSub" type="text" placeholder="Add a subscription" ref="name" required />
        <button type="submit" className="btn btn-primary"> Add</button>
      </div>
    </form>);
  }
});

var SubscriptionList = React.createClass({
  render: function() {
    var subNodes = this.props.data.map(function(sub) { 
      return (
        <Subscription name={ sub } key={ sub }></Subscription>
      );
    });
    return (
      <table className="table table-striped text-center subscriptionList">
        { subNodes }
      </table>
    );
  }
});

var Subscription = React.createClass({
  render: function() {
    return (
      <tr className="subscription">
        <td><a href={ '/user/' + this.props.name }>{ this.props.name }</a></td>     
        <td><span className="glyphicon glyphicon-remove"></span></td>
      </tr>
    );
  }
});

var subscriptionsEl = document.getElementById('subscriptions');
React.render(
  <SubscriptionBox url={ '/api/users/' + subscriptionsEl.getAttribute('data-id') } />,
  subscriptionsEl
);
