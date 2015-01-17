var $spinner = $('#spinner');
var subscriptionsEl = document.getElementById('subscriptions');
var id = subscriptionsEl ? subscriptionsEl.getAttribute('data-id') : '';

var SubscriptionBox = React.createClass({
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
    }.bind(this));
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
      <div className="subscriptionBox">
        <SubscriptionForm data={this.state.data} onSubscriptionSubmit={this.handleSubscriptionSubmit} />
        <SubscriptionList data={this.state.data} onSubscriptionRemove= {this.handleSubscriptionRemove} />
      </div>
    );
  }
});

var SubscriptionForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault(); 
    this.props.onSubscriptionSubmit(this.refs.name.getDOMNode().value.trim(),
                                    this.refs.name.getDOMNode);
  },
  render: function() {
    return (<form className="subscriptionForm" onSubmit={this.handleSubmit}>
      <div className="form-group">
        <input id="searchSub"
               type="text"
               placeholder={'Add a subscription (Total Subscriptions: ' + this.props.data.length + ')'}
               ref="name"
               required />
        <button type="submit" className="btn btn-primary">Add</button>
      </div>
    </form>);
  }
});

var SubscriptionList = React.createClass({
  passSubscriptionRemove: function(sub) {
    this.props.onSubscriptionRemove(sub);
  },
  render: function() {
    var subNodes = this.props.data.map(function(sub) { 
      return (
        <Subscription name={sub} onSubscriptionRemove={this.passSubscriptionRemove}>
        </Subscription>
      );
    }.bind(this));
    return (
      <table className="table table-striped text-center subscriptionList">
        <tbody>
          {subNodes}
        </tbody>
      </table>
    );
  }
});

var Subscription = React.createClass({
  handleClick: function() {
    this.props.onSubscriptionRemove(this.props.name);
  },
  render: function() {
    return (
      <tr className="subscription">
        <td><a href={'/user/' + this.props.name}>{this.props.name}</a></td>     
        <td><span className="glyphicon glyphicon-remove" onClick={this.handleClick}></span></td>
      </tr>
    );
  }
});

React.render(
  <SubscriptionBox url={'/api/users/' + id} />,
  subscriptionsEl
);
