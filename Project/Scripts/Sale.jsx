class Sale extends React.Component {
    constructor(props) {
        super(props);
        this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
        this.handleModalSaveClick = this.handleModalSaveClick.bind(this);
        this.state = {
            sales: [],
            customers: [],
            stores: [],
            products:[],
            saleDetails: null,
            showModal: false,
            isEdit: false,
            isCreate: false,
            isDelete: false,
            emptySale: {
                Id: 0,
                CustomerId: 0,
                ProductId: 0,
                StoreId:0,
                DateSold: ''
            }
        }
        
    }

    handleModalCloseClick() {
        this.setState({
            showModal: false,
            saleDetails: null,
            isEdit: false,
            isCreate: false,
            isDelete:false,
        })
    }
   
    render() {
        const { showModal } = this.state;
        return (
            <div>

                <button className="ui primary button" onClick={() => this.handleClickCreate()} > New Sale</button>
                <table className="ui striped celled table">
                    <thead>
                        <tr>
                            <th className="col-md-3">Customer</th>
                            <th className="col-md-4">Product</th>
                            <th className="col-md-5">Sale</th>
                            <th className="col-md-6">DateSold</th>
                            <th className="col-md-7">Actions</th>
                            <th className="col-md-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.sales.map((p) => {
                            return p;
                        })}
                    </tbody>
                </table>
                {showModal ? (<SaleModal handleModalCloseClick={this.handleModalCloseClick} handleModalSaveClick={this.handleModalSaveClick} handleDelete={this.handleDelete} products={this.state.products} stores={this.state.stores} customers={this.state.customers} sale={this.state.saleDetails} Editing={this.state.isEdit} Deleting={this.state.isDelete} Creating={this.state.isCreate} />) : null}
                   
            </div>
        );
    }
    componentWillMount() {
        fetch("/Sales/GetSales").
            then(result => { return result.json() }).
            then((data) => {
                let sale =
                    data.map((r) => {
                        return (
                            <tr key={r.Id}>
                                <td className="col-md-4">{r.CustomerName}</td>
                                <td className="col-md-4">{r.ProductName}</td>
                                <td className="col-md-4">{r.StoreName}</td>
                                <td className="col-md-4">{moment(r.DateSold).format("DD/MM/YYYY HH:ss")}</td>
                                <td className="col-md-2" ><button className="ui yellow labled button" onClick={() => this.handleClickEdit(r)}><i className="edit icon" /> EDIT</button></td>
                                <td className="col-md-2"><button className="ui red labled button" onClick={() => this.handleClickDelete(r)} ><i className="trash icon" />DELETE</button></td>
                            </tr>
                        );
                    })
                this.setState({ sales: sale });

            })
        fetch("/Customer/GetCustomers").
            then(result => { return result.json() }).
            then((data) => {
                this.setState({ customers: data });

            })
        fetch("/Products/GetProducts").
            then(result => { return result.json() }).
            then((data) => {
                this.setState({ products: data });

            })
        fetch("/Store/GetStores").
            then(result => { return result.json() }).
            then((data) => {
                this.setState({ stores: data });

            })

    }   

    handleClickCreate() {
        this.setState({
            showModal: true,
            saleDetails: this.state.emptySale,
            isEdit: false,
            isDelete: false,
            isCreate: true
        })
    }

    handleClickEdit(sale) {
        this.setState({
            showModal: true,
            saleDetails: sale,
            isEdit: true,
            isDelete: false,
            isCreate: false
        })
    }

    handleClickDelete(sale) {
        this.setState({
            showModal: true,
            saleDetails: sale,
            isEdit: false,
            isDelete: true,
            isCreate: false
        })
    }

    handleModalSaveClick(sale, isCreate) {
        this.handleModalCloseClick();
        if (isCreate) {
            fetch('/Sales/Create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(sale)
            }).then((res) => {
                if (res.status == 200) {
                    alert('Sale Detail is successfully saved');
                    window.location.href = "/Sales";
                }
            });
        }
        else {

            console.log(sale)
            console.log(JSON.stringify(sale))
            fetch('/Sales/Edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(sale)

            }).then((res) => {
                if (res.status == 200) {
                    alert('Sales Detail is successfully Saved');
                    window.location.href = "/Sales";
                } else {
                    alert('Sorry, something went wrong');
                }
            });
        }
    }

    handleDelete(sale) {
        fetch('/Sales/Delete', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(sale)
        }).then((res) => {
            if (res.status == 200) {
                alert('Sale Detail is successfully Deleted');
                window.location.href = "/Sales";
            }
        })

    }

}

class SaleModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: props.Editing,
            isCreate: props.Creating,
            isDelete: props.Deleting,
            sale: props.sale,
            customers: props.customers,
            isDateValid: false,
            dateValidate: {}
            
        }

        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.valueChanged = this.valueChanged.bind(this);
        this.isvalidateDate = this.isvalidateDate.bind(this);
    }
    handleCloseClick() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('hide');
        handleModalCloseClick();
    }

    onSaveClick(isCreating) {
        const { handleModalSaveClick } = this.props;
        $(this.modal).modal('hide');

        handleModalSaveClick(this.state.sale, isCreating);
    }
    onDeleteClick() {
        const { handleDelete } = this.props;
        $(this.modal).modal('hide');
        handleDelete(this.state.sale);
    }

    render() {
        return (
            <section>
                <div className="ui modal" ref={modal => this.modal = modal}>
                    <div className="header">
                        <i style={this.state.isEdit ? {} : { display: 'none' }}>Edit Sales</i>
                        <i style={this.state.isCreate ? {} : { display: 'none' }}>Create Sales</i>
                        <i style={this.state.isDelete ? {} : { display: 'none' }}>Delete Sales</i>
                    </div>
                    <div className="content">

                        <form className="ui form" style={this.state.isEdit || this.state.isCreate ? {} : { display: 'none' }}>

                            <div className="field">
                                <label>Date Sold</label>
                                <div className="ui calendar test1" id="DateSold">
                                    <div className="ui input left icon">
                                        <i className="calendar icon"></i>
                                        <input type="text" placeholder="Date/Time" name="DateSold" value={this.state.DateSold}  />

                                    </div>
                                </div>

                                <label className="ui pointing red basic label" style={!this.state.isDateValid ? {} : { display: 'none' }} >Please enter proper Date.</label>
                            </div>
                            <div className="field">
                                <label>Customer</label>
                                <select onChange={this.valueChanged} name="CustomerId" defaultValue={this.state.sale.CustomerId} >
                                    {
                                        this.props.customers.map(function (customer) {
                                            return <option key={customer.Id} value={customer.Id}>{customer.Name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="field">
                                <label>Product</label>
                                <select onChange={this.valueChanged} name="ProductId">
                                    {
                                        this.props.products.map(function (product) {
                                            return <option key={product.Id} value={product.Id}>{product.Name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="field">
                                <label>Store</label>
                                <select onChange={this.valueChanged} name="StoreId">
                                    {
                                        this.props.stores.map(function (store) {
                                            return <option key={store.Id} value={store.Id}>{store.Name}</option>
                                        })
                                    }
                                </select>
                            </div>
                            
                        </form>
                        <div style={this.state.isDelete  ? {} : { display: 'none' }}>
                            Are you sure you want to delete this sale detail?
                        </div>
                    </div>
                    <div className="actions">
                        <button className="ui positive black deny button" >Cancel</button>
                        <button className="ui positive right labeled icon button" style={this.state.isEdit ? {} : { display: 'none' }} onClick={() => this.onSaveClick(false)} disabled={!this.state.isDateValid}> Save < i className="checkmark icon" /></button>
                        <button className="ui positive right labeled icon button" style={this.state.isCreate ? {} : { display: 'none' }} onClick={() => this.onSaveClick(true)} disabled={!this.state.isDateValid}>Save<i className="checkmark icon" /></button>
                        <button className="ui red right labeled icon button" style={this.state.isDelete ? {} : { display: 'none' }} onClick={() => this.onDeleteClick()}>Delete<i className="remove icon" /></button>
                    </div>
                </div>
            </section>

            )
    }

    componentDidMount() {
        const { handleModalCloseClick } = this.props;
        var self = this;
        $(this.modal).modal({
            onHide: function () {
                handleModalCloseClick()
            },
            onApprove: function () {
                return false;
            }
        }).modal('setting', 'closable', false).modal('show');

        $('.test1').calendar({
            popupOptions: {
                observeChanges: false
            },
            onChange: function (date, text) {
                var sale = {
                    ...self.state.sale
                }

                sale.DateSold = date;
                self.setState({ sale }, () => {
                    self.isvalidateDate()
                });
            },
        });

        if (self.props.sale.DateSold)
            $('.test1').calendar("set date", moment(self.props.sale.DateSold).toDate());

        if (self.state.isCreate) {
            var sale = {
                ...self.state.sale
            }

            sale.CustomerId = self.props.customers[0].Id;
            sale.StoreId = self.props.stores[0].Id;
            sale.ProductId = self.props.products[0].Id;
            self.setState({ sale });
        }
    }

    isvalidateDate() {
        let sale = this.state.sale;
        let isDateValid = this.state.isDateValid;

        isDateValid = sale.DateSold && moment(moment(sale.DateSold).format(moment.ISO_8691), moment.ISO_8691, true).isValid();

        this.setState({
            isDateValid: isDateValid
            
        }
        );
    }

    valueChanged(e) {
        e.persist();
        var sale = {
            ...this.state.sale
        }

        sale[e.target.name] = $(e.target).find(":selected").val();
        this.setState({ sale });
       
    }


}

ReactDOM.render(<Sale />, document.getElementById('sale'));