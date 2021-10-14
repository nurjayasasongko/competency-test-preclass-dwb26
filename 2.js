const countVoucher = (voucherType, money) => {
  let discount, minimumPayment, moneyChanges, payment;
  if (voucherType === "DumbwaysMantap") {
    minimumPayment = 80000;
    // Minimum Payment Check
    if (money < minimumPayment) {
      console.log(
        `You can use this voucher with a minimum purchase of Rp${minimumPayment}`
      );
    } else {
      // Discount Check
      discount = (money * 30) / 100;
      if (discount > 40000) {
        discount = 40000;
      }

      payment = money - discount;
      moneyChanges = money - payment;

      console.log(`Total Comes to : Rp${payment}`);
      console.log(`Discount : Rp${discount}`);
      console.log(`Changes : Rp${moneyChanges}`);
    }
  } else if (voucherType === "DumbwaysJos") {
    minimumPayment = 50000;
    // Minimum Payment Check
    if (money < minimumPayment) {
      console.log(
        `You can use this voucher with a minimum purchase of Rp${minimumPayment}`
      );
    } else {
      // Discount Check
      discount = (money * 211) / 1000;
      if (discount > 20000) {
        discount = 20000;
      }
      payment = money - discount;
      moneyChanges = money - payment;

      console.log(`Total Comes to : Rp${payment}`);
      console.log(`Discount : Rp${discount}`);
      console.log(`Changes : Rp${moneyChanges}`);
    }
  }
};

countVoucher("DumbwaysJos", 40000);
