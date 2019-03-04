class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
        this.handleModalSaveClick = this.handleModalSaveClick.bind(this);

        this.state = {
            customers: [],
            customerDetails: null,
            showModal: false,
            isEdit: false,
            isCreate: false,
            isDelete: false,
            emptyCustomer: {
                Id: 0,
                Name: '',
                Address: ''
            }
        }
    }

    handleModalCloseClick() {
        this.setState({
            showModal: false,
            customerDetails: null,
            isEdit: false,
            isCreate: false,
            isDelete: false
        })
    }

    render() {
        const { showModal } = this.state;
        return (
            <div>
                
                <button className="ui primary button" onClick={() => this.handleClickCreate()} > New Customer</button>
                <table className="ui striped celled table">
                    <thead>
                        <tr>
                            <th className="col-md-3">Name</th>
                            <th className="col-md-4">Address</th>
                            <th className="col-md-5">Actions</th>
                            <th className="col-md-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.customers.map((p) => {
                            return p;
                        })}
                    </tbody>
                </table>
                {showModal ? (<CustomerModal handleModalCloseClick={this.handleModalCloseClick} handleDelete={this.handleDelete} handleModalSaveClick={this.handleModalSaveClick} customer={this.state.customerDetails} Editing={this.state.isEdit} Deleting={this.state.isDelete} Creating={this.state.isCreate} />) : null}
            </div>
        );
    }

    componentWillMount() {
        fetch("/Customer/GetCustomers").
            then(result => { return result.json() }).
            then((data) => {
                let customer =
                    data.map((r) => {
                        return (
                            <tr key={r.Id}>
                                <td className="col-md-4">{r.Name}</td>
                                <td className="col-md-4">{r.Address}</td>
                                <td className="col-md-2" ><button className="ui yellow labled button" onClick={() => this.handleClickEdit(r)}><i className="edit icon" /> EDIT</button></td>
                                <td className="col-md-2"><button className="ui red labled button" onClick={() => this.handleClickDelete(r)} ><i className="trash icon" />DELETE</button></td>
                            </tr>
                        );
                    })
                this.setState({ customers: customer });

            })

    }

    handleClickCreate() {
        this.setState({
            showModal: true,
            customerDetails: this.state.emptyCustomer,
            isEdit: false,
            isDelete: false,
            isCreate: true
        }) 
    }

    handleClickEdit(customer) {
        this.setState({
            showModal: true,
            customerDetails: customer,
            isEdit: true,
            isDelete: false,
            isCreate: false
        })
    }

    handleClickDelete(customer) {
        this.setState({
            showModal: true,
            customerDetails: customer,
            isEdit: false,
            isDelete: true,
            isCreate: false
        })
    }

    handleModalSaveClick(customer, isCreate) {
        this.handleModalCloseClick();
       
        if (isCreate) {
            fetch('/Customer/Create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(customer)
            }).then((res) => {
                if (res.status == 200) {
                    alert('Customer Detail is successfully Saved');
                    window.location.href = "/Customer";
                }
            });
        }
        else
        {
            fetch('/Customer/Edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(customer)
            }).then((res) => {
                if (res.status == 200) {
                    alert('Customer Detail is successfully Saved');
                    window.location.href = "/Customer";
                }
            });
        }

    }

    handleDelete(customer) {
        fetch('/Customer/Delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(customer)
        }).then((res) => {
            if (res.status == 200) {
                alert('Customer Detail is successfully Deleted');
                window.location.href = "/Customer";
            }
        })

    }

}

class CustomerModal extends React.Component {
    constructor(props) {
        super(props);
       
       
        this.state = {
            isEdit: props.Editing,
            isCreate: props.Creating,
            isDelete: props.Deleting,
            customer: props.customer,
            isValid: false,
            isNameValid: false,
            isAddressValid: false,
            fieldValid: {},
            canDelete: false
        }
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.valueChanged = this.valueChanged.bind(this);
        this.isFieldValid = this.isFieldValid.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
       
    }

    handleCloseClick() {
        const { handleModalCloseClick } = this.props;

        $(this.modal).modal('hide');
        handleModalCloseClick();
    }

    onSaveClick(isCreating) {
        const { handleModalSaveClick } = this.props;

        $(this.modal).modal('hide');
        handleModalSaveClick(this.state.customer, isCreating);
    }

    onDeleteClick() { 
        const { handleDelete } = this.props;
        $(this.modal).modal('hide');
        handleDelete(this.state.customer);

    
    }

    render() {

        return (
           <section>
            <div className="ui modal" ref={modal => this.modal = modal} >
               
                    <div className="header">
                        <i style={ this.state.isEdit ? {} : { display: 'none'}}>Edit customer</i>
                        <i style={this.state.isCreate ? {} : { display: 'none'}}>Create customer</i>
                        <i style={this.state.isDelete ? {} : { display: 'none'}}>Delete customer</i>
                    </div>
                    <div className="content">

                        <form className="ui form" style={this.state.isEdit || this.state.isCreate ? {} : { display: 'none' }}>

                            <div className="field">
                                <label> Name</label>
                                <input type="text" name="Name" value={this.state.customer.Name} onChange={this.valueChanged} />
                                <label className="ui pointing red basic label" style={!this.state.isNameValid ? {} : { display: 'none' }} >{this.state.fieldValid.Name}</label>

                            </div>
                            <div className="field">
                                <label>Address</label>
                                <input type="text" name="Address" value={this.state.customer.Address} onChange={this.valueChanged} />
                                <label className="ui pointing red basic label" style={!this.state.isAddressValid ? {} : { display: 'none' }} >{this.state.fieldValid.Address}</label>
                            </div>

                        </form>

                        <div style={this.state.isDelete && this.state.canDelete ? {} : { display: 'none' }}>
                            Are you sure you want to delete this customer?
                        </div>
                        <div style={this.state.isDelete && !this.state.canDelete ? {} : { display: 'none' }}>
                            Sorry! You can not Delete this Customer.
                        </div>

                    </div>
                    <div className="actions">
                        <button className="ui positive black deny button" >Cancel</button>
                        <button className="ui positive right labeled icon button" style={this.state.isEdit ? {} : { display: 'none' }} onClick={() => this.onSaveClick(false)} disabled={!this.state.isValid}> Save < i className="checkmark icon" /></button>
                        <button className="ui positive right labeled icon button" style={this.state.isCreate ? {} : { display: 'none' }} onClick={() => this.onSaveClick(true)} disabled={!this.state.isValid} >Save<i className="checkmark icon" /></button>
                        <button className="ui red right labeled icon button" style={this.state.isDelete && this.state.canDelete ? {} : { display: 'none' }} onClick={() => this.onDeleteClick()}>Delete<i className="remove icon" /></button>
                </div>
            </div>
            </section>
        )
    }

    componentDidMount() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal({
            onHide: function () {
                handleModalCloseClick()
            },
            onApprove: function () {
                return false;
            }
        }).modal('setting','closable',false).modal('show');

        if (this.state.isDelete) {
            fetch('/Customer/Delete?id=' + this.state.customer.Id).
                then(result => { return result.json() }).
                then((data) => {
                    this.setState({
                        canDelete: data.CanDelete 
                    })

                })
        } else {

            let self = this;

            self.isFieldValid("Name");
            setTimeout(function () { self.isFieldValid("Address"); }, 200)
        }
        
    }

    isFieldValid(fieldName) {
        let customer = this.state.customer;
        let fieldValid = this.state.fieldValid;
        let isNameValid = this.state.isNameValid;
        let isAddressValid = this.state.isAddressValid;

        switch (fieldName) {
            case 'Name':
                isNameValid = customer.Name.match("^[a-zA-Z \s]*$") && this.state.customer.Name.length > 3 && this.state.customer.Name.length <= 50 ;
                fieldValid.Name = isNameValid ? '' : "Please enter proper name";
                break;
            case 'Address':
                isAddressValid = customer.Address.match("^[a-zA-Z0-9,/' \s]*$") && this.state.customer.Address.length > 3 && this.state.customer.Address.length <= 50;
                fieldValid.Address = isAddressValid ? '' : "Please enter proper address";
                break;
            default:
                break;
        }

        this.setState({
            fieldValid: fieldValid,
            isNameValid: isNameValid,
            isAddressValid: isAddressValid
        }, this.validateForm
        );
    }

    validateForm() {
        this.setState({ isValid: this.state.isAddressValid && this.state.isNameValid });
    }

    valueChanged(e) {
        e.persist();
        
        var customer = {
            ...this.state.customer      

        }
        customer[e.target.name] = e.target.value
        this.setState({ customer }, () => {
            this.isFieldValid(e.target.name)
        });
    }   
    
}


ReactDOM.render(<Customer />, document.getElementById('customer'));

