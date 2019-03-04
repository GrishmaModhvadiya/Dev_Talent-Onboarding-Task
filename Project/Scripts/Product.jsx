class Product extends React.Component {
    constructor(props) {
        super(props);
        this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
        this.handleModalSaveClick = this.handleModalSaveClick.bind(this);
        this.state = {
            products: [],
            productDetails: null,
            showModal: false,
            isEdit: false,
            isCreate: false,
            isDelete: false,
            emptyProduct: {
                Id: 0,
                Name: '',
                Price:0
            }
        }
    }

    handleModalCloseClick() {
        this.setState({
            showModal: false,
            productDetails: null,
            isEdit: false,
            isCreate: false,
            isDelete: false
        })
    }

    render() {
        const { showModal } = this.state;
        return (
            <div>

                <button className="ui primary button" onClick={() => this.handleClickCreate()} > New Product</button>
                <table className="ui striped celled table">
                    <thead>
                        <tr>
                            <th className="col-md-3">Name</th>
                            <th className="col-md-4">Price</th>
                            <th className="col-md-5">Actions</th>
                            <th className="col-md-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.products.map((p) => {
                            return p;
                        })}
                    </tbody>
                </table>
                {showModal ? (<ProductModal handleModalCloseClick={this.handleModalCloseClick} handleModalSaveClick={this.handleModalSaveClick} handleDelete={this.handleDelete} product={this.state.productDetails} Editing={this.state.isEdit} Deleting={this.state.isDelete} Creating={this.state.isCreate} />) : null}
            </div>
        );
    }

    handleClickCreate() {
        this.setState({
            showModal: true,
            productDetails: this.state.emptyProduct,
            isEdit: false,
            isDelete: false,
            isCreate: true
        })
    }

    handleClickEdit(product) {
        this.setState({
            showModal: true,
            productDetails: product,
            isEdit: true,
            isDelete: false,
            isCreate: false
        })
    }

    handleClickDelete(product) {
        this.setState({
            showModal: true,
            productDetails: product,
            isEdit: false,
            isDelete: true,
            isCreate: false
        })
    }

    handleModalSaveClick(product, isCreate) {
        this.handleModalCloseClick();

        if (isCreate) {
            fetch('Products/Create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(product)
            }).then((res) => {
                if (res.status == 200) {
                    alert('Product Detail is successfully created');
                    location.reload();
                }
            });
            
        }

        else {
            fetch('Products/Edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(product)

            }).then((res) => {
                if (res.status == 200) {
                    alert('Product detail is successfully saved');
                    location.reload();

                }
            });
            
        }
    }

    handleDelete(product) {
        fetch('/Products/Delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(product)
        }).then((res) => {
            if (res.status == 200) {
                alert('Product Detail is successfully Deleted');
                window.location.href = "/Products";
            }
        })

    }



    componentWillMount() {
        fetch("/Products/GetProducts").
            then(result => { return result.json() }).
            then((data) => {
                let product =
                    data.map((r) => {
                        return (
                            <tr key={r.Id}>
                                <td className="col-md-4">{r.Name}</td>
                                <td className="col-md-4">${r.Price}</td>
                                <td className="col-md-2" ><button className="ui yellow labled button" onClick={() => this.handleClickEdit(r)}><i className="edit icon" /> EDIT</button></td>
                                <td className="col-md-2"><button className="ui red labled button" onClick={() => this.handleClickDelete(r)} ><i className="trash icon" />DELETE</button></td>
                            </tr>
                        );
                    })
                this.setState({ products: product });

            })

    }

}

class ProductModal extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isEdit: props.Editing,
            isCreate: props.Creating,
            isDelete: props.Deleting,
            product: props.product,
            isValid: false,
            isNameValid: false,
            isPriceValid:false,
            fieldValid: {},
            canDelete:false
        }

        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.valueChanged = this.valueChanged.bind(this);
        this.isFeildValid = this.isFeildValid.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleCloseClick() {
        const { handleModalCloseClick } = this.props;

        $(this.modal).modal('hide');
        handleModalCloseClick();
    }

    onSaveClick(isCreating) {
        const { handleModalSaveClick } = this.props;
        $(this.modal).modal('hide');
        handleModalSaveClick(this.state.product, isCreating);
    }

    onDeleteClick() {
        const { handleDelete } = this.props;
        $(this.modal).modal('hide');
        handleDelete(this.state.product);
    }

    render() {

        return (
            <section>
                <div className="ui modal" ref={modal => this.modal = modal} >

                    <div className="header">
                        <i style={this.state.isEdit ? {} : { display: 'none' }}>Edit customer</i>
                        <i style={this.state.isCreate ? {} : { display: 'none' }}>Create customer</i>
                        <i style={this.state.isDelete ? {} : { display: 'none' }}>Delete customer</i>
                    </div>
                    <div className="content">

                        <form className="ui form" style={this.state.isEdit || this.state.isCreate ? {} : { display: 'none' }}>
                            <div className="field">
                                <label> Name</label>
                                <input type="text" name="Name" value={this.state.product.Name} onChange={this.valueChanged} />
                                <label className="ui pointing red basic label" style={!this.state.isNameValid ? {} : { display: 'none' }} >{this.state.fieldValid.Name}</label >
                            </div>
                            <div className="field">
                                <label>Price</label>
                                <input type="number" min="0" name="Price" value={this.state.product.Price} onChange={this.valueChanged} />
                                <label className="ui pointing red basic label" style={!this.state.isPriceValid ? {} : { display: 'none' }} >{this.state.fieldValid.Price}</label >
                            </div>

                        </form>

                        <div style={this.state.isDelete && this.state.canDelete ? {} : { display: 'none' }}>
                            Are you sure you want to delete this product?
                        </div>

                        <div style={this.state.isDelete && !this.state.canDelete ? {} : { display: 'none' }}>
                            Sorry! You can not Delete this product.
                        </div>
                    </div>

                    <div className="actions">
                        <button className="ui possitive black deny button" >Cancel</button>
                        <button className="ui positive right labeled icon button" style={this.state.isEdit ? {} : { display: 'none' }} onClick={() => this.onSaveClick(false)} disabled={!this.state.isValid} > Save < i className="checkmark icon" /></button>
                        <button className="ui positive right labeled icon button" style={this.state.isCreate ? {} : { display: 'none' }} onClick={() => this.onSaveClick(true)} disabled={!this.state.isValid}>Save<i className="checkmark icon" /></button>
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
        }).modal('setting', 'closable', false).modal('show');

        if (this.state.isDelete) {
            fetch('/Products/Delete?id=' + this.state.product.Id).
                then(result => { return result.json() }).
                then((data) => {
                    this.setState({
                        canDelete: data.CanDelete
                    })
                })
        }
        else {
            let self = this;
            self.isFeildValid("Name");
            setTimeout(function () { self.isFeildValid("Price"); }, 200)
           
        }

    }

    isFeildValid(fieldName) {
        let product = this.state.product;
        let fieldValid = this.state.fieldValid;
        let isNameValid = this.state.isNameValid;
        let isPriceValid = this.state.isPriceValid;

        switch (fieldName) {
            case 'Name':
                isNameValid = product.Name.match("^[a-zA-Z \s]*$") && this.state.product.Name.length > 3 && this.state.product.Name.length <= 50;
                fieldValid.Name = isNameValid ? '' : "Please enter proper product name";
                break;
            case 'Price':
                
                isPriceValid = product.Price>0;
                fieldValid.Price = isPriceValid ? '' : "Please enter proper price";
                break;
            default:
                break;
        }
        this.setState({
            fieldValid: fieldValid,
            isNameValid: isNameValid,
            isPriceValid: isPriceValid
        }, this.validateForm
        );
    }

    validateForm() {
        this.setState({ isValid: this.state.isNameValid && this.state.isPriceValid });
    }

    valueChanged(e) {
        e.persist();
        var product = { ...this.state.product }
        product[e.target.name] = e.target.value
        this.setState({ product }, () => { this.isFeildValid(e.target.name) });
    }
}


ReactDOM.render(<Product />, document.getElementById('product'));

