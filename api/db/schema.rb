# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_09_000009) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "messages", force: :cascade do |t|
    t.string "address_one", null: false
    t.string "address_two"
    t.string "city", null: false
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.text "message", null: false
    t.string "name", null: false
    t.string "phone", null: false
    t.boolean "read", default: false
    t.string "state", null: false
    t.text "subject", null: false
    t.datetime "updated_at", null: false
    t.string "zip_code", null: false
  end

  create_table "orders", force: :cascade do |t|
    t.string "address", null: false
    t.string "address_2"
    t.string "city", null: false
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.text "order_description"
    t.string "phone", null: false
    t.bigint "product_id"
    t.string "product_size"
    t.string "state", null: false
    t.string "status", default: "received", null: false
    t.string "token"
    t.datetime "updated_at", null: false
    t.string "zip", null: false
    t.index ["product_id"], name: "index_orders_on_product_id"
    t.index ["token"], name: "index_orders_on_token", unique: true
  end

  create_table "product_images", force: :cascade do |t|
    t.string "alt_text", null: false
    t.string "caption"
    t.datetime "created_at", null: false
    t.jsonb "image_data"
    t.bigint "product_id"
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_product_images_on_product_id"
  end

  create_table "product_sizes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "dimensions", null: false
    t.string "name", null: false
    t.integer "position", default: 1
    t.integer "price_cents"
    t.bigint "product_id"
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_product_sizes_on_product_id"
  end

  create_table "products", force: :cascade do |t|
    t.jsonb "banner_image_data"
    t.integer "base_price_cents"
    t.datetime "created_at", null: false
    t.text "description"
    t.boolean "discontinued", default: false
    t.jsonb "list_image_data"
    t.string "name", null: false
    t.boolean "released", default: false
    t.text "short_description"
    t.string "sku"
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_products_on_slug", unique: true
  end

  create_table "roles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_roles_on_name", unique: true
  end

  create_table "testimonials", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "customer_name", null: false
    t.text "excerpt"
    t.text "quote"
    t.boolean "released", default: false
    t.string "slug", null: false
    t.text "testimonial", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_testimonials_on_slug", unique: true
  end

  create_table "user_role_associations", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "role_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["role_id"], name: "index_user_role_associations_on_role_id"
    t.index ["user_id"], name: "index_user_role_associations_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name", null: false
    t.string "jti", null: false
    t.string "last_name", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "orders", "products"
  add_foreign_key "product_images", "products"
  add_foreign_key "product_sizes", "products"
  add_foreign_key "user_role_associations", "roles"
  add_foreign_key "user_role_associations", "users"
end
