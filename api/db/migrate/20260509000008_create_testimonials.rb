class CreateTestimonials < ActiveRecord::Migration[8.1]
  def change
    create_table :testimonials do |t|
      t.string :customer_name, null: false
      t.text :excerpt
      t.text :testimonial, null: false
      t.boolean :released, default: false
      t.string :slug, null: false
      t.text :quote

      t.timestamps
    end

    add_index :testimonials, :slug, unique: true
  end
end
