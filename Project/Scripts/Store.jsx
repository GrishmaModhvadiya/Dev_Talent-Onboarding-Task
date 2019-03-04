class Store extends React.Component {
    constructor(props) {
        super(props);
        this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
        this.handleModalSaveClick = this.handleModalSaveClick.bind(this);

        this.state = {
            stores: [],
            storeDetails: null,
            showModal: false,
            isEdit: false,
            isCreate: false,
            isDelete: false,
            emptyStore: {
                Id:0,
                Name: '',
                Address:''
            }
        }
    }

    handleModalCloseClick() {
        this.setState({
            showModal: false,
            storeDetails: null,
            isEdit: false,
            isCreate: false,
            isDelete: false
        })
    }

    render() {
        const { showModal } = this.state;
        return (
            <div>

                <button className="ui primary button" onClick={() => this.handleClickCreate()} > New Store</button>
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
                        {this.state.stores.map((p) => {
                            return p;
                        })}
                    </tbody>
                </table>
                {showModal ? (<StoreModal handleModalCloseClick={this.handleModalCloseClick} handleDelete={this.handleDelete} handleModalSaveClick={this.handleModalSaveClick} store={this.state.storeDetails} Editing={this.state.isEdit} Deleting={this.state.isDelete} Creating={this.state.isCreate} />) : null}
            </div>
        );
    }

    componentWillMount() {

        fetch('/Store/GetStores').
            then(result => { return result.json() }).
            then((data) => {
                let store =
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
                this.setState({ stores: store });

            })

    }

    handleClickCreate() {
        this.setState({
            showModal: true,
            storeDetails: this.state.emptyStore,
            isEdit: false,
            isDelete: false,
            isCreate: true
        })
    }

    handleClickEdit(store) {
        this.setState({
            showModal: true,
            storeDetails: store,
            isEdit: true,
            isDelete: false,
            isCreate: false
        })
    }

    handleClickDelete(store) {
        this.setState({
            showModal: true,
            storeDetails: store,
            isEdit: false,
            isDelete: true,
            isCreate: false
        })
    }

    handleModalSaveClick(store, isCreate) {
        this.handleModalCloseClick();

        if (isCreate) {
            fetch('/Store/Create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(store)
            }).then((res) => {
                if (res.status == 200) {
                    alert('Store Detail is successfully Saved');
                    window.location.href = "/Store";
                }
            });
        }
        else {
            fetch('/Store/Edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(store)
            }).then((res) => {
                if (res.status == 200) {
                    alert('Store Detail is successfully Saved');
                    window.location.href = "/Store";
                }
            });
        }

    }

    handleDelete(store) {
        fetch('/Store/Delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(store)
        }).then((res) => {
            if (res.status == 200) {
                alert('Store Detail is successfully Deleted');
                window.location.href = "/Store";
            }
        })

    }

}

class StoreModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: props.Editing,
            isCreate: props.Creating,
            isDelete: props.Deleting,
            store: props.store,
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
        handleModalSaveClick(this.state.store, isCreating);
    }

    onDeleteClick() {
        const { handleDelete } = this.props;
        $(this.modal).modal('hide');
        handleDelete(this.state.store);
    }

    render() {

        return (
            <section>
                <div className="ui modal" ref={modal => this.modal = modal} >

                    <div className="header">
                        <i style={this.state.isEdit ? {} : { display: 'none' }}>Edit store</i>
                        <i style={this.state.isCreate ? {} : { display: 'none' }}>Create store</i>
                        <i style={this.state.isDelete ? {} : { display: 'none' }}>Delete store</i>
                    </div>
                    <div className="content">

                        <form className="ui form" style={this.state.isEdit || this.state.isCreate ? {} : { display: 'none' }}>
                            <div className="field">
                                <label> Name </label>
                                <input type="text" name="Name" value={this.state.store.Name} onChange={this.valueChanged} />
                                <div className="ui pointing red basic label" style={!this.state.isNameValid ? {} : { display: 'none' }} >{this.state.fieldValid.Name}</div>
                            </div>
                            <div className="field">
                                <label>Address</label>
                                <input type="text" name="Address" value={this.state.store.Address} onChange={this.valueChanged} />
                                <div className="ui pointing red basic label" style={!this.state.isAddressValid ? {} : { display: 'none' }} >{this.state.fieldValid.Address}</div>
                            </div>

                        </form>

                        <div style={this.state.isDelete && this.state.canDelete ? {} : { display: 'none' }}>
                            Are you sure you want to delete?
                        </div>
                        <div style={this.state.isDelete && !this.state.canDelete ? {} : { display: 'none' }}>
                            Sorry! You can not Delete this store detail.
                        </div>
                    </div>
                    <div className="actions">
                        <button className="ui possitive black deny button" >Cancel</button>
                        <button className="ui positive right labeled icon button" style={this.state.isEdit ? {} : { display: 'none' }} onClick={() => this.onSaveClick(false)} disabled={!this.state.isValid}> Save < i className="checkmark icon" /></button>
                        <button className="ui positive right labeled icon button" style={this.state.isCreate ? {} : { display: 'none' }} onClick={() => this.onSaveClick(true)} disabled={!this.state.isValid}>Save<i className="checkmark icon" /></button>
                        <button className="ui red right labeled icon button" style={this.state.isDelete && this.state.canDelete ? {} : { display: 'none' }} onClick={() => this.onDeleteClick()} >Delete<i className="remove icon" /></button>
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
        }).modal('setting', 'closable', false).modal('show');

        if (this.state.isDelete) {
            fetch('/Store/Delete?id=' + this.state.store.Id).
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
        let store = this.state.store;
        let fieldValid = this.state.fieldValid;
        let isNameValid = this.state.isNameValid;
        let isAddressValid = this.state.isAddressValid;

        switch (fieldName) {
            case 'Name':
                isNameValid = store.Name.match("^[a-zA-Z& \s]*$") && this.state.store.Name.length > 1 && this.state.store.Name.length <= 50;
                fieldValid.Name = isNameValid ? '' : "Please enter proper name" ;
                break;
            case 'Address':
                isAddressValid = store.Address.match("^[a-zA-Z0-9,/' \s]*$") && this.state.store.Address.length > 3 && this.state.store.Address.length <= 50;
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
        var store = {
            ...this.state.store     
        }
        store[e.target.name] = e.target.value
        this.setState({ store }, () => {
            this.isFieldValid(e.target.name)
        });
    }

}


ReactDOM.render(<Store />, document.getElementById('store'));

