import Image from "next/image";
import { Shield, Recycle, Users, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/navbar";
import MobileTabBar from "@/components/mobile-tab-bar";

const values = [
  {
    icon: Shield,
    title: "Kualitas Terjamin",
    description:
      "Setiap produk melalui inspeksi ketat untuk memastikan kualitas dan keamanan terbaik untuk si kecil.",
  },
  {
    icon: Recycle,
    title: "Ramah Lingkungan",
    description:
      "Mendukung ekonomi sirkular dengan memberikan kehidupan kedua pada perlengkapan bayi berkualitas.",
  },
  {
    icon: Users,
    title: "Komunitas Terpercaya",
    description:
      "Membangun komunitas ibu-ibu yang saling mendukung dalam mengasuh anak dengan bijak.",
  },
  {
    icon: Heart,
    title: "Peduli Keluarga",
    description:
      "Memahami kebutuhan keluarga Indonesia untuk perlengkapan bayi berkualitas dengan harga terjangkau.",
  },
];

const team = [
  {
    name: "Tristan Putra Wilau",
    role: "Founder & CEO",
    image: "/about/tristan.jpg",
    description:
      "Ibu dari 2 anak yang memahami betul kebutuhan perlengkapan bayi berkualitas.",
  },
  {
    name: "Muhammad Nizwa",
    role: "Head of Operations",
    image: "/about/nizwa.jpg",
    description:
      "Berpengalaman 10+ tahun dalam supply chain dan quality control.",
  },
  {
    name: "Andrian Pratama",
    role: "Customer Experience Manager",
    image: "/about/andrian.jpg",
    description:
      "Memastikan setiap customer mendapat pengalaman terbaik di ANKT.",
  },
  {
    name: "Fransiskus Xaverius Kevin",
    role: "Head of Technology",
    image: "/about/kevin.jpg",
    description:
      "Mengembangkan platform digital yang user-friendly dan aman untuk semua pengguna.",
  },
];

const stats = [
  { number: "10,000+", label: "Produk Terjual" },
  { number: "5,000+", label: "Customer Puas" },
  { number: "50+", label: "Kota Terjangkau" },
  { number: "4.8/5", label: "Rating Customer" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-8">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-stone-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-stone-800 mb-6 leading-tight">
                Tentang <span className="text-emerald-700">ANKT</span>
              </h1>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed">
                ANKT adalah marketplace terpercaya yang menghadirkan
                perlengkapan bayi bekas berkualitas tinggi dengan harga
                terjangkau. Kami percaya bahwa setiap keluarga berhak
                mendapatkan produk terbaik untuk si kecil tanpa harus menguras
                kantong.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  <Link href="/products">Mulai Belanja</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">Hubungi Kami</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/about/about.jpg"
                alt="ANKT Team"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              Misi Kami
            </h2>
            <p className="text-stone-600 max-w-3xl mx-auto text-lg">
              Menjadi platform terdepan dalam menyediakan perlengkapan bayi
              bekas berkualitas, mendukung gaya hidup berkelanjutan, dan
              membantu keluarga Indonesia menghemat pengeluaran tanpa
              mengorbankan kualitas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-emerald-700" />
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pencapaian Kami
            </h2>
            <p className="text-emerald-100 text-lg">
              Kepercayaan customer adalah prioritas utama kami
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">Tim Kami</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Dibalik ANKT adalah tim yang berpengalaman dan berdedikasi untuk
              memberikan yang terbaik bagi customer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-emerald-700 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-stone-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-stone-800 mb-6">
                Cerita Kami
              </h2>
              <div className="space-y-4 text-stone-700">
                <p>
                  ANKT lahir dari pengalaman pribadi sebagai orang tua yang
                  memahami betul tantangan dalam menyediakan perlengkapan bayi
                  berkualitas dengan budget terbatas. Kami melihat banyak
                  perlengkapan bayi yang masih layak pakai namun tidak terpakai
                  lagi.
                </p>
                <p>
                  Dari sinilah ide ANKT muncul - menciptakan platform yang
                  menghubungkan orang tua yang ingin menjual perlengkapan bayi
                  bekas dengan mereka yang membutuhkannya. Setiap produk yang
                  kami jual telah melalui proses kurasi dan quality check yang
                  ketat.
                </p>
                <p>
                  Hari ini, ANKT telah melayani ribuan keluarga di seluruh
                  Indonesia dan terus berkomitmen untuk menyediakan perlengkapan
                  bayi berkualitas dengan harga terjangkau sambil mendukung gaya
                  hidup berkelanjutan.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/about/tempat.jfif"
                alt="ANKT Story"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bergabunglah dengan Komunitas ANKT
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari gerakan berkelanjutan dan dapatkan perlengkapan
            bayi terbaik untuk si kecil
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-700 hover:bg-stone-100"
            >
              <Link href="/products">Mulai Belanja</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white text-emerald-700 hover:bg-stone-100"
            >
              <Link href="#">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/logo.png"
                  alt="ANKT Logo"
                  width={40}
                  height={40}
                  className="rounded"
                />
                <h3 className="text-xl font-bold">ANKT</h3>
              </div>
              <p className="text-stone-800 mb-4">
                Marketplace terpercaya untuk perlengkapan bayi bekas
                berkualitas. Mendukung gaya hidup berkelanjutan untuk keluarga
                Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-stone-800">
                <li>
                  <Link
                    href="/products?category=stroller"
                    className="hover:text-white transition-colors"
                  >
                    Stroller & Kereta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=car-seat"
                    className="hover:text-white transition-colors"
                  >
                    Car Seat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=feeding"
                    className="hover:text-white transition-colors"
                  >
                    Feeding
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=toys"
                    className="hover:text-white transition-colors"
                  >
                    Mainan
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-stone-800">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pengiriman
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Garansi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Customer Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-stone-800">
                <li>Email: info@ankt.co.id</li>
                <li>WhatsApp: +62 812-3456-7890</li>
                <li>Jam Operasional: 09:00 - 18:00 WIB</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-800">
            <p>&copy; 2024 ANKT. Semua hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
      <MobileTabBar />
    </div>
  );
}
