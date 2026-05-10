class CreateMessages < ActiveRecord::Migration[8.1]
  def change
    create_table :messages do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.text :message, null: false
      t.text :subject, null: false
      t.string :address_one, null: false
      t.string :address_two
      t.string :city, null: false
      t.string :state, null: false
      t.string :zip_code, null: false
      t.string :phone, null: false
      t.boolean :read, default: false

      t.timestamps
    end
  end
end
