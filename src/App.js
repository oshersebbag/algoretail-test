import React from "react";
import DataGrid, {
  Column,
  Summary,
  Editing,
  RequiredRule,
  MasterDetail,
  TotalItem,
  RangeRule
} from "devextreme-react/data-grid";
import shows from "./data/shows.json";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myShows: shows.shows
    };
    this.numberList = this.numberList.bind(this);
    this.setRemainingTickets = this.setRemainingTickets.bind(this);
  }

  setRemainingTickets(rowData) {
    const orders = rowData.orders;
    let sum = 0;
    let index = this.state.myShows.indexOf(rowData);
    let arr = this.state.myShows;

    if (orders) {
      orders.forEach(purchase => {
        if (purchase["number-of-tickets"] == 0) {
          sum += 0;
        } else {
          sum += purchase["number-of-tickets"];
        }
      });
      const remaining = rowData["total-tickets"] - sum;
      arr[index]["remaining-tickets"] = remaining;
      this.setState({ myShows: arr });
      return remaining;
    } else {
      if (arr[index]) {
        arr[index]["remaining-tickets"] = arr[index]["total-tickets"];
        this.setState({ myShows: arr });
        return rowData["total-tickets"];
      } else {
        return "";
      }
    }
  }

  numberList(rowData) {
    let index = this.state.myShows.indexOf(rowData);
    return index + 1;
  }

  render() {
    return (
      <div className="App">
        <DataGrid
          dataSource={this.state.myShows}
          showColumnLines={false}
          showRowLines={false}
          showBorders={false}
          rowAlternationEnabled={true}
        >
          <Column
            width={70}
            caption=""
            dataType="string"
            calculateCellValue={this.numberList}
          ></Column>
          <Column dataField="title" caption="Show Title" dataType="string">
            {" "}
            <RequiredRule />
          </Column>
          <Column
            dataField="total-tickets"
            caption="Total Tickets Available"
            dataType="number"
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="remaining-tickets"
            caption="Remaining Tickets"
            dataType="number"
            calculateCellValue={this.setRemainingTickets}
          ></Column>
          <Editing mode="cell" allowAdding={true} allowDeleting={true} />
          <MasterDetail enabled={true} component={masterDetailOrders} />
        </DataGrid>
      </div>
    );
  }
}

const masterDetailOrders = props => {
  let myOrders = props.data.key.orders;
  if (!myOrders) {
    myOrders = props.data.key.orders = [
      {
        name: "",
        "number-of-tickets": 0
      }
    ];
  }

  return (
    <div className="orders">
      <DataGrid
        dataSource={myOrders}
        showColumnLines={true}
        showRowLines={true}
        showBorders={true}
      >
        <Column dataField="name" caption="name" dataType="string">
          <RequiredRule />
        </Column>
        <Column
          dataField="number-of-tickets"
          caption="amount of tickets"
          dataType="number"
        >
          <RangeRule
            message="not enough tickets. sorry!"
            max={props.data.key["remaining-tickets"]}
          />
          <RangeRule message="You must order at least 1 ticket" min={1} />
          <RequiredRule />
        </Column>
        <Editing
          mode="cell"
          allowAdding={true}
          allowDeleting={true}
          allowUpdating={true}
        />
        <Summary>
          <TotalItem
            column="number-of-tickets"
            summaryType="sum"
            alignByColumn={true}
            displayFormat={"Total: {0}"}
            showInGroupFooter={true}
          />
        </Summary>
      </DataGrid>
    </div>
  );
};

export default App;
